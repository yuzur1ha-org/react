import js from "@eslint/js"
import json from "@eslint/json"
import markdown from "@eslint/markdown"
import tseslint from "typescript-eslint"
import hooks from "eslint-plugin-react-hooks"
import a11y from "eslint-plugin-jsx-a11y"
import prettier from "eslint-config-prettier/flat"
import globals from "globals"

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/.pnpm-store/**",
      "**/dist/**",
      "**/.cache/**",
      "**/out/**",
      "**/coverage/**",
      ".local/**",
      ".husky/_/**",
      "**/test-results/**",
      "**/playwright-report/**",
      "**/.project-*/**",
      "**/.site-*/**",
    ],
  },
  {
    ...js.configs.recommended,
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx,mts,cts}"],
  },
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["*.{js,mjs,cjs}", "scripts/**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: { globals: globals.node },
  },
  {
    files: [
      "apps/docs/src/**/*.{ts,tsx}",
      "packages/{ui,press-theme,press-reference}/src/**/*.{ts,tsx}",
      "packages/press/src/{react,content}/**/*.{ts,tsx}",
      "packages/{ui,press-theme,press-reference}/tests/**/*.{ts,tsx}",
    ],
    languageOptions: { globals: globals.browser },
    rules: {
      "no-restricted-globals": [
        "error",
        "process",
        "Buffer",
        "__dirname",
        "__filename",
      ],
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: { "react-hooks": hooks, "jsx-a11y": a11y },
    rules: {
      ...a11y.configs.recommended.rules,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },
  {
    files: ["**/*.md", "**/*.markdown"],
    plugins: { markdown },
    extends: [markdown.configs.recommended],
    language: "markdown/gfm",
    languageOptions: { frontmatter: "yaml" },
  },
  {
    files: ["packages/press/tests/fixtures/project/content/*.md"],
    rules: {
      // The fixture consumes a leading H1 as metadata, even with an explicit title.
      "markdown/no-multiple-h1": ["error", { frontmatterTitle: "" }],
    },
  },
  {
    files: ["**/*.json"],
    plugins: { json },
    extends: [json.configs.recommended],
    language: "json/json",
  },
  {
    files: ["**/*.jsonc", "**/tsconfig*.json", ".vscode/*.json"],
    plugins: { json },
    extends: [json.configs.recommended],
    language: "json/jsonc",
    languageOptions: { allowTrailingCommas: true },
  },
  {
    files: [
      "packages/{markdown,press,token}/tests/**/*.{ts,tsx}",
      "packages/**/scripts/**/*.mjs",
      "packages/**/tests/**/*.mjs",
      "packages/**/src/node/**/*.ts",
      "packages/**/src/site/**/*.ts",
      "packages/markdown/src/vite/**/*.ts",
      "packages/shared/src/**/*.ts",
      "packages/press/src/vite/**/*.ts",
      "**/*.config.ts",
      "apps/docs/scripts/**/*.ts",
    ],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["./*.js", "../*.js", "./**/*.js", "../**/*.js"],
              message:
                "Omit JavaScript extensions in TypeScript source imports.",
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      "packages/press/src/{node,site,vite}/**/*.ts",
      "packages/markdown/src/vite/**/*.ts",
      "packages/shared/src/**/*.ts",
      "**/*.config.ts",
      "scripts/**/*.mjs",
      "apps/docs/scripts/**/*.ts",
    ],
    rules: {
      "no-restricted-globals": ["error", "window", "document", "localStorage"],
    },
  },
  prettier,
)
