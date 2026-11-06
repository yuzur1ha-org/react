import { describe, expect, it } from "vitest"
import { readFile } from "node:fs/promises"
import {
  tokens,
  darkTokens,
  tokenVar,
  heroUIVariables,
  deriveTokens,
  toCSSVariables,
  toHeroUIVariables,
} from "../../src/index"

describe("public token artifacts", () => {
  it("generates CSS from the same token values exported to TypeScript", async () => {
    const css = await readFile(
      new URL("../../dist/tokens.css", import.meta.url),
      "utf8",
    )
    for (const [name, value] of Object.entries(tokens))
      expect(css).toContain(`--yu-${name}: ${value};`)
    expect(tokenVar("ink")).toBe("var(--yu-ink)")
    expect(css).not.toMatch(/\b(body|button|input)\s*\{/u)
  })
  it("maps HeroUI roles to known tokens within an opt-in theme", async () => {
    const css = await readFile(
      new URL("../../dist/heroui.css", import.meta.url),
      "utf8",
    )
    expect(css).toContain('[data-theme="yuzur1ha"]')
    for (const [role, token] of Object.entries(heroUIVariables)) {
      expect(tokens).toHaveProperty(token)
      expect(css).toContain(`--${role}: var(--yu-${token});`)
    }
    expect(heroUIVariables.accent).toBe("primary")
    expect(heroUIVariables["field-background"]).toBe("surface")
  })
})

it("derives semantic roles from seeds, applies overrides last and leaves defaults untouched", () => {
  const theme = deriveTokens(
    { ink: "#006b5a", spaceUnit: 5, motionNormal: 220 },
    { focus: "#00778c" },
  )
  expect(theme.ink).toBe("#006b5a")
  expect(theme.focus).toBe("#00778c")
  expect(theme["space-3"]).toBe("20px")
  expect(theme["motion-normal"]).toBe("220ms")
  expect(deriveTokens({ ink: "#006b5a" }).focus).toBe("#006b5a")
  expect(toCSSVariables(theme)["--yu-space-3"]).toBe("20px")
  expect(toHeroUIVariables(theme)["--accent"]).toBe(theme.ink)
  expect(tokens.ink).toBe("#131415")
  expect(Object.isFrozen(tokens)).toBe(true)
  expect(Object.isFrozen(theme)).toBe(true)
  expect(deriveTokens({ spaceUnit: 1 })["input-height"]).toBe("44px")
  expect(() => deriveTokens({ spaceUnit: 0 })).toThrow(RangeError)
  expect(() => deriveTokens({ motionNormal: -1 })).toThrow(RangeError)
})

it("derives functional roles and dark colors without changing the light default", async () => {
  const custom = deriveTokens({
    mode: "dark",
    primary: "#99ccbb",
    warn: "#eecc99",
  })
  expect(custom.primary).toBe("#99ccbb")
  expect(custom.focus).toBe(custom.primary)
  expect(custom["warn-subtle"]).toContain("#eecc99")
  expect(custom["primary-foreground"]).toBe(darkTokens.paper)
  expect(custom["scrollbar-track"]).toBe(darkTokens.subtle)
  expect(darkTokens["color-scheme"]).toBe("dark")
  expect(tokens["color-scheme"]).toBe("light")
  const hero = toHeroUIVariables(custom)
  expect(hero["--accent"]).toBe(custom.primary)
  expect(hero["--warning"]).toBe(custom.warn)
  expect(hero["--success"]).toBe(custom.success)
  const css = await readFile(
    new URL("../../dist/tokens.css", import.meta.url),
    "utf8",
  )
  expect(css).toContain('[data-yuzur1ha-theme="dark"]')
  for (const [name, value] of Object.entries(darkTokens))
    expect(css).toContain(`--yu-${name}: ${value};`)
})
function luminance(hex: string) {
  const full =
    hex.length === 4
      ? `#${[...hex.slice(1)].map((value) => value + value).join("")}`
      : hex
  const channels = [1, 3, 5]
    .map((offset) => parseInt(full.slice(offset, offset + 2), 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    )
  return (
    (channels[0] ?? 0) * 0.2126 +
    (channels[1] ?? 0) * 0.7152 +
    (channels[2] ?? 0) * 0.0722
  )
}
it("keeps functional foreground pairs readable in both supplied themes", () => {
  for (const theme of [tokens, darkTokens]) {
    for (const name of [
      "primary",
      "warn",
      "error",
      "success",
      "info",
    ] as const) {
      const a = luminance(theme[name])
      const b = luminance(theme[`${name}-foreground`])
      expect(
        (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
        `${theme["color-scheme"]}/${name}`,
      ).toBeGreaterThanOrEqual(4.5)
    }
  }
})

it("rejects finite seed dimensions that overflow derived CSS lengths", () => {
  expect(() => deriveTokens({ spaceUnit: Number.MAX_VALUE })).toThrow(
    RangeError,
  )
  for (const value of Object.values(deriveTokens({ spaceUnit: 8 })))
    expect(value).not.toContain("Infinity")
})

it("publishes one framework-free Markdown stylesheet for CSS and JavaScript consumers", async () => {
  const { markdownStyles } = await import("../../src/markdown/index")
  const output = await readFile(
    new URL("../../dist/markdown.css", import.meta.url),
    "utf8",
  )
  expect(output).toBe(markdownStyles)
  for (const name of new Set(
    Array.from(output.matchAll(/var\(--yu-([a-z0-9-]+)/g), (match) => match[1]),
  )) {
    if (name?.startsWith("markdown-")) continue
    expect(tokens).toHaveProperty(name ?? "")
    expect(darkTokens).toHaveProperty(name ?? "")
  }
  expect(output).not.toMatch(/(?:^|\n)(?:html|body|:root)\s*\{/)
})
