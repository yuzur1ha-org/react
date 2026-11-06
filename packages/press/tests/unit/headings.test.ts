import { writeFile } from "node:fs/promises"
import { join } from "node:path"
import { expect, it } from "vitest"
import { uniqueHeadingId } from "../../src/content"
import { analyzeProject } from "../../src/node"
import { fixture } from "./project-fixture"

it("allocates unique IDs across generated suffixes, Unicode and reserved IDs", () => {
  const used = new Set(["explicit"])
  expect(
    [
      "Heading",
      "Heading-1",
      "Heading",
      "Heading",
      "中文",
      "中文",
      "Ａ",
      "!",
      "Explicit",
    ].map((title) => uniqueHeadingId(title, used)),
  ).toEqual([
    "heading",
    "heading-1",
    "heading-2",
    "heading-3",
    "中文",
    "中文-1",
    "a",
    "section",
    "explicit-1",
  ])
})

it("preserves explicit IDs and keeps generated IDs distinct in default Markdown", async () => {
  const root = await fixture()
  await writeFile(
    join(root, "yupress.config.ts"),
    `export default {content:{srcDir:"content"},site:{title:"Headings",locales:[
      {id:"en",lang:"en",label:"English",sourceDir:"",prefix:""}
    ]}}`,
  )
  const path = join(root, "content/hello.md")
  await writeFile(
    path,
    '# Title\n\n## Heading\n\n## Heading-1\n\n## Heading\n\n## Kept\n\n<h2 id="kept">Explicit</h2>',
  )
  const snapshot = await analyzeProject({ root })
  expect(snapshot.documents[0]?.metadata).toMatchObject({
    toc: [
      { id: "heading" },
      { id: "heading-1" },
      { id: "heading-2" },
      { id: "kept-1" },
      { id: "kept" },
    ],
  })
  await writeFile(
    path,
    '# Title\n\n<h2 id="same">One</h2>\n\n<div id="same">Two</div>',
  )
  await expect(analyzeProject({ root })).rejects.toThrow(
    "Duplicate explicit ID: same",
  )
})
