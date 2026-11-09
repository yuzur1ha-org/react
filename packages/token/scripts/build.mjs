import { URL } from "node:url"
import { mkdir, writeFile } from "node:fs/promises"
import {
  tokens,
  darkTokens,
  heroUIVariables,
  toCSSVariables,
  tokenVar,
} from "../dist/index.js"
await mkdir(new URL("../dist", import.meta.url), { recursive: true })
const declarations = (theme) =>
  Object.entries(toCSSVariables(theme))
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n")
await writeFile(
  new URL("../dist/tokens.css", import.meta.url),
  `:root, [data-yuzur1ha-theme="light"] {\n${declarations(tokens)}\n  color-scheme: light;\n}\n[data-yuzur1ha-theme="dark"] {\n${declarations(darkTokens)}\n  color-scheme: dark;\n}\n`,
)
const aliases = Object.entries(heroUIVariables)
  .map(([name, token]) => `  --${name}: ${tokenVar(token)};`)
  .join("\n")
await writeFile(
  new URL("../dist/heroui.css", import.meta.url),
  `@import "./tokens.css";\n\n[data-theme="yuzur1ha"] {\n  color-scheme: var(--yu-color-scheme);\n${aliases}\n}\n`,
)

const { markdownStyles } = await import("../dist/markdown/index.js")
await writeFile(
  new URL("../dist/markdown.css", import.meta.url),
  markdownStyles,
)
