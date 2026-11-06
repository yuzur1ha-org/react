export default {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: false,
  jsxSingleQuote: false,
  trailingComma: "all",
  endOfLine: "lf",
  embeddedLanguageFormatting: "auto",
  overrides: [
    {
      files: ["**/*.md", "**/*.markdown"],
      options: { parser: "markdown", proseWrap: "never" },
    },
    {
      files: "**/*.json",
      options: { parser: "json", trailingComma: "none" },
    },
    {
      files: "**/package.json",
      options: { parser: "json-stringify" },
    },
    {
      files: ["**/*.jsonc", "**/tsconfig*.json", ".vscode/*.json"],
      options: { parser: "jsonc", trailingComma: "none" },
    },
  ],
}
