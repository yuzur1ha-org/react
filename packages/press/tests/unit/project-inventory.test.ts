import { readdir, readFile, rm, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { expect, it } from "vitest"
import { generate } from "../../src/node/index"
import { fixture } from "./project-fixture"

it("removes stale owned locale modules while preserving shared translation IDs", async () => {
  const root = await fixture()
  await rm(join(root, "content/hello.md"))
  for (const locale of ["en", "zh-cn"])
    await writeFile(
      join(root, `content/${locale}.md`),
      `---\nid: greeting\nlocale: ${locale}\n---\n# Greeting`,
    )
  const snapshot = await generate({ root })
  expect(snapshot.documents.map((document) => document.key)).toEqual([
    "en/greeting",
    "zh-cn/greeting",
  ])
  expect(await readdir(snapshot.outputDir)).toContain("metadata-zh-cn.ts")
  await rm(join(root, "content/zh-cn.md"))
  await expect(generate({ root }, true)).rejects.toThrow("Stale")
  await generate({ root })
  expect(await readdir(snapshot.outputDir)).not.toContain("metadata-zh-cn.ts")
})
it("keeps hidden documents in inventory and rejects broken sidebar references", async () => {
  const root = await fixture()
  await writeFile(
    join(root, "content/hidden.md"),
    "---\nid: hidden\n---\n# Hidden",
  )
  const snapshot = await generate({ root })
  expect(snapshot.documents.map((document) => document.key)).toEqual([
    "greeting",
    "hidden",
  ])
  const config = join(root, "yupress.config.ts")
  await writeFile(
    config,
    (await readFile(config, "utf8")).replace(
      "sections: []",
      'sections: [{id:"reference",label:"Reference",documents:["greeting"]}]',
    ),
  )
  await rm(join(root, "content/hello.md"))
  await expect(generate({ root })).rejects.toThrow("Unknown section document")
})
it("validates excluded sources but publishes only approved document loaders and metadata", async () => {
  const root = await fixture()
  const configPath = join(root, "yupress.config.ts")
  const config = await readFile(configPath, "utf8")
  await writeFile(
    configPath,
    config.replace(
      "export default defineConfig",
      "const configuration = defineConfig",
    ) +
      "\ndelete configuration.site\nconfiguration.content.publish = () => false\nexport default configuration\n",
  )
  const snapshot = await generate({ root })
  expect(snapshot.documents).toHaveLength(0)
  for (const name of ["manifest.ts", "loaders.ts", "index.json"])
    expect(
      await readFile(join(snapshot.outputDir, name), "utf8"),
    ).not.toContain("hello.md")
  expect(
    await readFile(join(snapshot.outputDir, "documents.d.ts"), "utf8"),
  ).toContain("DocumentKey = never")
  await writeFile(
    join(root, "content/hello.md"),
    "---\nid: greeting\ntitle: false\n---\n# Invalid excluded source",
  )
  await expect(generate({ root })).rejects.toThrow("Invalid title")
})
