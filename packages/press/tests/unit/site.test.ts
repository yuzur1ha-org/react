import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises"
import { join, resolve } from "node:path"
import { expect, it } from "vitest"
import {
  contentRoute,
  normalizeBase,
  translatedDocument,
} from "../../src/content"
import { buildSite, previewSite } from "../../src/site"

it("rejects unsafe bases and colliding directory routes", () => {
  for (const base of ["preview/", "/preview", "/../", "/a//b/", "/%2e/"])
    expect(() => normalizeBase(base)).toThrow()
  const locale = {
    id: "en",
    lang: "en",
    label: "English",
    sourceDir: "en",
    prefix: "",
  }
  expect(contentRoute("guide.md", locale)).toBe(
    contentRoute("guide/index.md", locale),
  )
  expect(() => contentRoute("guide.mdx", locale)).toThrow("Unsupported")
  expect(() => contentRoute("../outside.md", locale)).toThrow()
  expect(contentRoute("中文.md", locale)).toBe("/%E4%B8%AD%E6%96%87/")
  expect(typeof translatedDocument).toBe("function")
})

it("builds a bilingual Markdown-only site and serves a real static deep link under base", async () => {
  const root = await mkdtemp(resolve(import.meta.dirname, "../../.site-"))
  try {
    for (const locale of ["en", "zh-cn"]) {
      await mkdir(join(root, "content", locale), { recursive: true })
      await writeFile(
        join(root, "content", locale, "index.md"),
        `# ${locale} index\n\n[Read guide](./guide.md)\n`,
      )
      await writeFile(
        join(root, "content", locale, "guide.md"),
        `# ${locale} guide\n\n${"Large static body. ".repeat(1800)}\n\n## Read this\n\n## Read this-1\n\n## Read this\n\n[Last heading](#read-this-2)\n\n![Marker](./marker.svg)\n`,
      )
      await writeFile(
        join(root, "content", locale, "marker.svg"),
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="M0 0h10v10H0z"/></svg>',
      )
    }
    await writeFile(
      join(root, "yupress.config.ts"),
      `import { defineConfig } from '@yuzur1ha/press'
export default defineConfig({theme:"@yuzur1ha/press-theme",site:{title:'Press fixture',base:'/manual/',locales:[
{id:'en',lang:'en',label:'English',sourceDir:'en',prefix:''},
{id:'zh-cn',lang:'zh-CN',label:'中文',sourceDir:'zh-cn',prefix:'zh-cn'},
]}})
`,
    )
    const result = await buildSite({ root })
    expect(result.documents).toBe(4)
    const html = await readFile(
      join(result.output, "zh-cn/guide/index.html"),
      "utf8",
    )
    expect(html).toContain('lang="zh-CN"')
    expect(html).toContain("zh-cn guide")
    expect(html).not.toContain("<!--$?-->")
    expect(html).not.toContain('<div hidden id="S:')
    expect(html).toContain('id="read-this"')
    expect(html).toContain('id="read-this-1"')
    expect(html).toContain('id="read-this-2"')
    expect(html).toContain('href="#read-this-2"')
    expect(html).toContain("/manual/_content/")
    expect(await readdir(join(result.output, "_content"))).toHaveLength(1)
    const home = await readFile(join(result.output, "index.html"), "utf8")
    expect(home).toContain('href="/manual/guide/"')
    await rename(join(root, "content"), join(root, "content-backup"))
    await rename(join(root, "yupress.config.ts"), join(root, "press-backup.ts"))
    await symlink(
      join(root, "content-backup"),
      join(result.output, "linked-content"),
      "junction",
    )
    const server = await previewSite({ root, port: 0 })
    try {
      const address = server.address()
      if (!address || typeof address === "string")
        throw new Error("Missing server address")
      const origin = `http://127.0.0.1:${address.port}`
      expect((await fetch(origin + "/manual/zh-cn/guide/")).status).toBe(200)
      expect((await fetch(origin + "/manual/missing/")).status).toBe(404)
      expect(
        (await fetch(origin + "/manual/linked-content/en/guide.md")).status,
      ).toBe(404)
      expect(await readFile(join(result.output, "404.html"))).toEqual(
        await readFile(join(result.output, "404/index.html")),
      )
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()))
    }
    await rename(join(root, "content-backup"), join(root, "content"))
    await rename(join(root, "press-backup.ts"), join(root, "yupress.config.ts"))
    await writeFile(join(root, "content/en/collision.md"), "# Collision\n")
    await mkdir(join(root, "content/en/collision"))
    await writeFile(
      join(root, "content/en/collision/index.md"),
      "# Duplicate\n",
    )
    await expect(buildSite({ root })).rejects.toThrow(
      "Duplicate document route",
    )
    expect(await readFile(join(result.output, "index.html"), "utf8")).toBe(home)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}, 30000)

it("refuses publication through an external directory link or an invalid ownership marker", async () => {
  const root = await mkdtemp(resolve(import.meta.dirname, "../../.site-"))
  const external = await mkdtemp(resolve(import.meta.dirname, "../../.site-"))
  try {
    await mkdir(join(root, "content"))
    await writeFile(join(root, "content/index.md"), "# Home")
    await writeFile(
      join(root, "yupress.config.ts"),
      "export default {theme:'@yuzur1ha/press-theme',site:{title:'Guard',locales:[{id:'en',lang:'en',label:'English',sourceDir:'',prefix:''}]}}",
    )
    await symlink(external, join(root, "linked"), "junction")
    await expect(buildSite({ root, outDir: "linked/site" })).rejects.toThrow(
      "Unsafe site output",
    )
    expect(await readdir(external)).toEqual([])
    await mkdir(join(root, "dist"))
    await writeFile(join(root, "dist/.yupress-output"), "unrelated")
    await writeFile(join(root, "dist/keep.txt"), "user data")
    await expect(buildSite({ root })).rejects.toThrow("unowned site output")
    expect(await readFile(join(root, "dist/keep.txt"), "utf8")).toBe(
      "user data",
    )
  } finally {
    await rm(root, { recursive: true, force: true })
    await rm(external, { recursive: true, force: true })
  }
})
