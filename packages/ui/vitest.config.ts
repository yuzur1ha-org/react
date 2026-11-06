import { defineConfig } from "vitest/config"
export default defineConfig({
  root: import.meta.dirname,
  test: {
    name: "ui",
    environment: "jsdom",
    include: [
      "src/components/**/*.test.{ts,tsx}",
      "tests/unit/**/*.test.{ts,tsx}",
    ],
    setupFiles: ["./tests/setup.ts"],
    restoreMocks: true,
  },
})
