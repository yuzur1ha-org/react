import { expect, it } from "vitest"
import { compileGuide } from "../../scripts/content/guide"
import { designUrl, designEmbed } from "../../src/docs/figma/model"
const url = "https://www.figma.com/design/IsRDCNqIZ1gy7t2aV8YHza?node-id=38-725"
it("compiles a Docs-owned directive without placing Figma in Press metadata", async () => {
  const result = await compileGuide(
    `# Design\n\n::figma{url="${url}" title="Button design"}`,
    "design/index.md",
    "unused",
  )
  expect(result.code).toContain("FigmaPreview")
  expect(result.metadata).not.toHaveProperty("figma")
  await expect(
    compileGuide(
      `---\nfigma: ${url}\n---\n# Design`,
      "design/index.md",
      "unused",
    ),
  ).rejects.toThrow("Unknown metadata field")
})
it("rejects missing titles and unknown preview attributes", async () => {
  for (const directive of [
    `::figma{url="${url}"}`,
    `::figma{url="${url}" title="Design" unknown="value"}`,
  ])
    await expect(
      compileGuide(`# Design\n\n${directive}`, "design/index.md", "unused"),
    ).rejects.toThrow()
})

it("only accepts concrete HTTPS Figma design nodes and builds the official embed URL", () => {
  for (const value of [
    "javascript:alert(1)",
    "https://evil.example/design/file?node-id=1-2",
    "https://www.figma.com/design/file",
    "https://user:secret@www.figma.com/design/file?node-id=1-2",
  ])
    expect(() => designUrl(value)).toThrow()
  const embed = new URL(designEmbed(url, "dark"))
  expect(embed.origin).toBe("https://embed.figma.com")
  expect(embed.searchParams.get("node-id")).toBe("38-725")
  expect(embed.searchParams.get("theme")).toBe("dark")
  expect(embed.searchParams.get("embed-host")).toBe("yuzur1ha-docs")
})
