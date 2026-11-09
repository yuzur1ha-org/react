import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { join, resolve } from "node:path"
import { expect, it } from "vitest"
import { watchProject } from "../../src/node/index"
import { directories, fixture } from "./project-fixture"

it.each(["gif", "avif", "PNG"])(
  "regenerates compiled image URLs when a tracked %s image changes",
  async (extension) => {
    const root = await fixture()
    const image = `image.${extension}`
    await writeFile(
      join(root, "yupress.config.ts"),
      `export default {
  content: { srcDir: "content" },
  site: { title: "Images", locales: [
    { id: "en", lang: "en", label: "English", sourceDir: "", prefix: "" },
  ] },
}`,
    )
    await writeFile(
      join(root, "content/hello.md"),
      `# Images\n\n![Image](./${image})`,
    )
    await writeFile(join(root, "content", image), "original image bytes")
    const compiled: string[] = []
    const errors: unknown[] = []
    const close = watchProject({ root }, (snapshot, error) => {
      if (snapshot) compiled.push(snapshot.documents[0]?.compiled.code ?? "")
      if (error) errors.push(error)
    })
    try {
      await expect.poll(() => compiled.length).toBe(1)
      expect(compiled[0]).toContain("/_content/")
      await writeFile(join(root, "content", image), "updated image bytes")
      await expect.poll(() => compiled.length).toBe(2)
      expect(compiled[1]).not.toBe(compiled[0])
      expect(errors).toEqual([])
    } finally {
      await close()
    }
  },
)

it.each(["file", "directory"])(
  "watches additions, %s deletion, invalid input and recovery without watching generated output",
  async (removed) => {
    const root = await fixture()
    let updates = 0
    let failures = 0
    const close = watchProject({ root }, (snapshot, error) => {
      if (snapshot) updates++
      if (error) failures++
    })
    try {
      await expect.poll(() => updates).toBe(1)
      await new Promise((resolve) => setTimeout(resolve, 250))
      expect(updates).toBe(1)
      await writeFile(
        join(root, "content/hello.md"),
        "---\nid: greeting\ntitle: false\n---\n# Fallback",
      )
      await expect.poll(() => failures).toBeGreaterThan(0)
      await writeFile(
        join(root, "content/hello.md"),
        "---\nid: recovered\n---\n# Recovered",
      )
      await expect.poll(() => updates).toBe(2)
      await mkdir(join(root, "content/new"))
      await writeFile(
        join(root, "content/new/added.md"),
        "---\nid: added\n---\n# Added",
      )
      await expect
        .poll(async () =>
          (
            await readFile(join(root, ".cache/press/documents.d.ts"), "utf8")
          ).includes('"added"'),
        )
        .toBe(true)
      await rm(
        join(root, removed === "file" ? "content/new/added.md" : "content/new"),
        { recursive: removed === "directory" },
      )
      await expect
        .poll(async () =>
          (
            await readFile(join(root, ".cache/press/documents.d.ts"), "utf8")
          ).includes('"added"'),
        )
        .toBe(false)
      if (removed === "file") {
        await writeFile(
          join(root, "content/new/added.md"),
          "---\nid: added\n---\n# Added",
        )
        await expect
          .poll(async () =>
            (
              await readFile(join(root, ".cache/press/documents.d.ts"), "utf8")
            ).includes('"added"'),
          )
          .toBe(true)
      }
    } finally {
      await close()
    }
  },
  10000,
)
it("rebuilds imported TS configuration and watches sources outside the project root", async () => {
  const root = await fixture()
  const external = await mkdtemp(
    resolve(import.meta.dirname, "../../.external-"),
  )
  directories.push(external)
  const config = join(root, "yupress.config.ts")
  const original = await readFile(config, "utf8")
  await mkdir(join(external, "nested"))
  await writeFile(join(external, "settings.ts"), 'export const title = "First"')
  await writeFile(
    config,
    `import { title } from ${JSON.stringify(join(external, "settings.ts"))}\n` +
      original
        .replace('srcDir: "content"', `srcDir: ${JSON.stringify(external)}`)
        .replace(
          "const id = compiled.metadata.id",
          "compiled.metadata.title = title\n        const id = compiled.metadata.id",
        ),
  )
  await writeFile(
    join(external, "outside.md"),
    "---\nid: external\n---\n# External",
  )
  let updates = 0
  const errors: unknown[] = []
  const close = watchProject({ root }, (snapshot, error) => {
    if (snapshot) updates++
    if (error) errors.push(error)
  })
  try {
    await expect.poll(() => updates, { timeout: 5000 }).toBeGreaterThan(0)
    await writeFile(
      join(external, "settings.ts"),
      'export const title = "Second"',
    )
    await expect
      .poll(
        async () =>
          (
            await readFile(join(root, ".cache/press/manifest.ts"), "utf8")
          ).includes('"Second"'),
        { timeout: 5000 },
      )
      .toBe(true)
    await writeFile(
      join(external, "nested/added.md"),
      "---\nid: added\n---\n# Added",
    )
    await expect
      .poll(
        async () =>
          (
            await readFile(join(root, ".cache/press/documents.d.ts"), "utf8")
          ).includes('"added"'),
        { timeout: 5000 },
      )
      .toBe(true)
    expect(errors).toEqual([])
  } finally {
    await close()
  }
})

it("waits for in-flight generation before stopping so cleanup cannot recreate the output", async () => {
  const root = await fixture()
  const config = join(root, "yupress.config.ts")
  const original = await readFile(config, "utf8")
  await writeFile(
    config,
    `import {existsSync,writeFileSync} from "node:fs"
import {setTimeout as delay} from "node:timers/promises"
` +
      original.replace(
        "setup(_context) {",
        `async setup(_context) {
 writeFileSync(${JSON.stringify(join(root, "started"))},"started")
 while(!existsSync(${JSON.stringify(join(root, "release"))})) await delay(10)
 `,
      ),
  )
  let updates = 0
  const close = watchProject({ root }, () => {
    updates++
  })
  try {
    await expect
      .poll(async () => readFile(join(root, "started"), "utf8").catch(() => ""))
      .toBe("started")
    const stopped = close()
    await writeFile(join(root, "release"), "release")
    await stopped
    expect(
      await readFile(join(root, ".cache/press/manifest.ts"), "utf8"),
    ).toContain("greeting")
    expect(updates).toBe(0)
  } finally {
    await writeFile(join(root, "release"), "release")
    await close()
  }
})

it("rebuilds default code enhancement when configuration changes", async () => {
  const root = await fixture()
  const config = join(root, "yupress.config.ts")
  const configuration = (code: string) =>
    `export default {content:{srcDir:"content"},code:${code},site:{title:"Code",locales:[{id:"en",lang:"en",label:"English",sourceDir:"",prefix:""}]}}`
  await writeFile(config, configuration("{copy:true}"))
  await writeFile(
    join(root, "content/hello.md"),
    "# Code\n\n```ts\nconst value = 1\n```\n",
  )
  const outputs: string[] = [],
    errors: unknown[] = []
  const close = watchProject({ root }, (snapshot, error) => {
    if (snapshot) outputs.push(snapshot.documents[0]?.compiled.code ?? "")
    if (error) errors.push(error)
  })
  try {
    await expect.poll(() => outputs.length).toBe(1)
    expect(outputs[0]).toContain("CodeBlock")
    await writeFile(config, configuration("false"))
    await expect.poll(() => outputs.length).toBe(2)
    expect(outputs[1]).not.toContain("CodeBlock")
    await writeFile(config, configuration("{highlight:false,copy:false}"))
    await expect.poll(() => outputs.length).toBe(3)
    expect(outputs[2]).toContain("CodeBlock")
    expect(outputs[2]).toContain('"copy": false')
    expect(outputs[2]).not.toContain("--yu-code-token")
    expect(errors).toEqual([])
  } finally {
    await close()
  }
})

it("updates a plugin input with a custom extension", async () => {
  const root = await fixture()
  const config = join(root, "yupress.config.ts")
  await writeFile(
    config,
    (await readFile(config, "utf8")).replace(
      "setup(_context) {",
      'setup(context) { context.read("caption.txt");',
    ),
  )
  const input = join(root, "caption.txt")
  let updates = 0
  let failures = 0
  const close = watchProject({ root }, (snapshot, error) => {
    if (snapshot) updates++
    if (error) failures++
  })
  try {
    await expect.poll(() => failures).toBeGreaterThan(0)
    await writeFile(input, "first")
    await expect.poll(() => updates).toBe(1)
    await writeFile(input, "second")
    await expect.poll(() => updates).toBe(2)
  } finally {
    await close()
  }
})
