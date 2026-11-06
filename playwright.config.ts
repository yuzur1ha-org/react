import { defineConfig, devices } from "@playwright/test"
import { resolve } from "node:path"
const root = import.meta.dirname
const suites = {
  "docs-polish": {
    directory: "apps/docs",
    port: 5178,
    command: "pnpm exec yupress dev --port 5178",
    tests: ["apps/docs/tests/polish/*.e2e.ts"],
  },
  "docs-polish-production": {
    directory: "apps/docs",
    port: 5177,
    command: "pnpm exec yupress preview --port 5177",
    tests: ["apps/docs/tests/polish/*.e2e.ts"],
  },
  docs: {
    directory: "apps/docs",
    port: 5173,
    command: "pnpm dev",
    tests: ["apps/docs/tests/e2e/**/*.e2e.ts"],
  },
  "docs-production": {
    directory: "apps/docs",
    port: 5177,
    command: "pnpm exec yupress preview --port 5177",
    tests: ["apps/docs/tests/production/*.e2e.ts"],
  },
  "docs-content": {
    directory: "apps/docs",
    port: 5176,
    command: "pnpm exec yupress dev --port 5176",
    tests: ["apps/docs/tests/content/*.e2e.ts"],
  },
}

type SuiteName = keyof typeof suites

const selectors = process.argv.flatMap((value, index, args) =>
  value.startsWith("--project=")
    ? [value.slice(10)]
    : value === "--project"
      ? [args[index + 1] ?? ""]
      : [],
)
const allNames = Object.keys(suites) as SuiteName[]
if (process.argv.includes("test") && !selectors.length)
  throw new Error(
    "Select a suite with --project=<suite>:* (docs, docs-production, docs-content, docs-polish, docs-polish-production, pages or press:ssg)",
  )
const names = allNames.filter((name) =>
  selectors.length
    ? selectors.some(
        (selector) => selector === name || selector.startsWith(name + ":"),
      )
    : false,
)

export default defineConfig({
  testDir: root,
  outputDir: "test-results/browser",
  fullyParallel: true,
  workers: 5,
  use: { trace: "retain-on-failure" },
  webServer: names
    .filter(
      (name, index) =>
        names.findIndex(
          (candidate) => suites[candidate].port === suites[name].port,
        ) === index,
    )
    .map((name) => ({
      cwd: resolve(root, suites[name].directory),
      command: suites[name].command,
      url: `http://127.0.0.1:${suites[name].port}`,
      reuseExistingServer: false,
    })),
  projects: [
    ...allNames.flatMap((name) =>
      (name.startsWith("docs-polish")
        ? ["chromium", "webkit"]
        : name === "docs-content"
          ? ["desktop"]
          : ["desktop", "mobile"]
      ).map((viewport) => ({
        name: `${name}:${viewport}`,
        testMatch: suites[name].tests,
        use: {
          ...(viewport === "webkit"
            ? devices["Desktop Safari"]
            : viewport === "chromium"
              ? devices["Desktop Chrome"]
              : viewport === "desktop"
                ? devices["Desktop Chrome"]
                : {
                    ...devices["iPhone 13"],
                    defaultBrowserType: "chromium" as const,
                  }),
          baseURL: `http://127.0.0.1:${suites[name].port}`,
        },
      })),
    ),
    {
      name: "pages",
      testMatch: ["apps/docs/tests/pages.e2e.mjs"],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "press:ssg",
      testMatch: ["packages/press/tests/ssg/site.e2e.mjs"],
      use: { ...devices["Desktop Chrome"] },
    },
  ],
})
