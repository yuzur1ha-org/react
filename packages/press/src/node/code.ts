import {
  compileDocument,
  type CompilerOptions,
} from "@yuzur1ha/markdown/compiler"
import {
  bundledLanguages,
  bundledLanguagesAlias,
  bundledThemes,
  createHighlighter,
} from "shiki"
import { createCssVariablesTheme } from "shiki/core"
import type { CodeOptions, HighlightedCode, CodeToken } from "../content/code"

const tokenTheme = createCssVariablesTheme({
  name: "yuzur1ha",
  variablePrefix: "--yu-code-",
})
const knownLanguage = (name: string) =>
  Object.hasOwn(bundledLanguages, name) ||
  Object.hasOwn(bundledLanguagesAlias, name)

export function validateCodeOptions(
  value: unknown,
): asserts value is CodeOptions | false | undefined {
  if (value === undefined || value === false) return
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid code configuration")
  const options = value as Record<string, unknown>
  for (const key of Object.keys(options))
    if (
      !["highlight", "theme", "copy", "lineNumbers", "languages"].includes(key)
    )
      throw new Error(`Unknown code option: ${key}`)
  for (const key of ["highlight", "copy", "lineNumbers"])
    if (options[key] !== undefined && typeof options[key] !== "boolean")
      throw new Error(`code.${key} must be boolean`)
  if (
    options.languages !== undefined &&
    (!Array.isArray(options.languages) ||
      !options.languages.every(
        (item: unknown) => typeof item === "string" && knownLanguage(item),
      ))
  )
    throw new Error("code.languages contains an unknown language")
  const theme = options.theme
  if (theme !== undefined && theme !== "tokens") {
    if (!theme || typeof theme !== "object" || Array.isArray(theme))
      throw new Error("Invalid code.theme")
    const pair = theme as Record<string, unknown>
    for (const key of ["light", "dark"])
      if (
        typeof pair[key] !== "string" ||
        !Object.hasOwn(bundledThemes, pair[key])
      )
        throw new Error(`Unknown code.theme.${key}`)
  }
}

export function createCodeService(configuration?: CodeOptions | false) {
  validateCodeOptions(configuration)
  const options = configuration || {}
  let highlighter: ReturnType<typeof createHighlighter> | undefined
  const warnings = new Set<string>()
  const getHighlighter = () =>
    (highlighter ??= createHighlighter({
      themes:
        options.theme && options.theme !== "tokens"
          ? ([options.theme.light, options.theme.dark] as Parameters<
              typeof createHighlighter
            >[0]["themes"])
          : [tokenTheme],
      langs: [],
    }))
  async function highlightCode(
    source: string,
    language?: string,
  ): Promise<HighlightedCode> {
    const result: HighlightedCode = {
      source,
      ...(language ? { language } : {}),
      lines: source.split("\n").map((text) => [{ text }]),
      copy: configuration !== false && options.copy !== false,
      lineNumbers: options.lineNumbers ?? false,
      enhanced: configuration !== false,
    }
    if (
      configuration === false ||
      options.highlight === false ||
      !language ||
      ["text", "txt", "plain", "plaintext"].includes(language)
    )
      return result
    const id = language.toLowerCase()
    if (!knownLanguage(id)) {
      if (!warnings.has(id)) {
        console.warn(
          `[YuPress] Unknown code language: ${language}; rendering plain text`,
        )
        warnings.add(id)
      }
      return result
    }
    const high = await getHighlighter()
    // Shiki resolves aliases after loading; compare grammar identities for allowlists.
    if (options.languages) {
      await high.loadLanguage(
        ...(options.languages as Parameters<typeof high.loadLanguage>),
      )
      const canonical = high.getLoadedLanguages().includes(id)
        ? high.getLanguage(id).name
        : undefined
      if (
        !canonical ||
        !options.languages.some(
          (allowed) => high.getLanguage(allowed)?.name === canonical,
        )
      )
        return result
    } else
      await high.loadLanguage(id as Parameters<typeof high.loadLanguage>[0])
    const themes =
      options.theme && options.theme !== "tokens"
        ? options.theme
        : { light: "yuzur1ha", dark: "yuzur1ha" }
    const tokens = high.codeToTokensWithThemes(source, {
      lang: id as NonNullable<
        Parameters<typeof high.codeToTokensWithThemes>[1]["lang"]
      >,
      themes: themes as NonNullable<
        Parameters<typeof high.codeToTokensWithThemes>[1]["themes"]
      >,
    })
    result.lines = tokens.map((line) =>
      line.map((token): CodeToken => ({
        text: token.content,
        ...(token.variants.light?.color
          ? { color: token.variants.light.color }
          : {}),
        ...(token.variants.dark?.color &&
        token.variants.dark.color !== token.variants.light?.color
          ? { darkColor: token.variants.dark.color }
          : {}),
        ...(token.variants.light?.fontStyle
          ? { fontStyle: token.variants.light.fontStyle }
          : {}),
      })),
    )
    return result
  }
  return {
    highlightCode,
    compileDocument<Metadata>(
      this: void,
      source: string,
      path: string,
      compiler: CompilerOptions<Metadata>,
    ) {
      const custom = compiler.elementRenderers
      return compileDocument(source, path, {
        ...compiler,
        elementRenderers: {
          ...custom,
          async pre(element, context) {
            if (configuration === false) return custom?.pre?.(element, context)
            const overridden = await custom?.pre?.(element, context)
            if (overridden) return overridden
            if (element.data?.markdownCode === undefined) return
            const code = element.children[0]
            if (code?.type !== "element" || code.tagName !== "code") return
            const classes = code.properties.className
            const language = Array.isArray(classes)
              ? classes.find(
                  (name) =>
                    typeof name === "string" && name.startsWith("language-"),
                )
              : undefined
            const data = await highlightCode(
              element.data.markdownCode,
              typeof language === "string" ? language.slice(9) : undefined,
            )
            return {
              component: { from: "@yuzur1ha/press/react", name: "CodeBlock" },
              props: { data },
              children: [],
            }
          },
          async table(element, context) {
            const overridden = await custom?.table?.(element, context)
            if (overridden) return overridden
            if (!element.data?.markdownTable) return
            return {
              component: {
                from: "@yuzur1ha/press/react",
                name: "MarkdownTable",
              },
              props: { properties: element.properties },
              children: element.children,
            }
          },
        },
      })
    },
    async dispose() {
      ;(await highlighter)?.dispose()
    },
  }
}
