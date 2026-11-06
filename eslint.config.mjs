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
      "apps/auth/public/mockServiceWorker.js",
      "apps/account/public/mockServiceWorker.js",
      "apps/vpn/public/mockServiceWorker.js",
      "apps/chat/public/mockServiceWorker.js",
      "**/.pnpm-store/**",
      "**/.next/**",
      "**/.turbo/**",
      "**/dist/**",
      "**/.cache/**",
      "**/out/**",
      "**/coverage/**",
      ".local/**",
      ".husky/_/**",
      "**/test-results/**",
      "**/playwright-report/**",
      "**/next-env.d.ts",
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
    files: [
      "*.{js,mjs,cjs}",
      "scripts/**/*.{js,mjs,cjs,ts,mts,cts}",
      "tests/**/*.{js,mjs,cjs,ts,mts,cts}",
    ],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["apps/**/*.{js,jsx,ts,tsx}", "packages/**/*.{js,jsx,ts,tsx}"],
    languageOptions: { globals: globals.browser },
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
      "packages/**/scripts/**/*.mjs",
      "packages/**/tests/**/*.mjs",
      "packages/**/src/node/**/*.ts",
      "packages/**/src/site/**/*.ts",
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
  prettier,
)
