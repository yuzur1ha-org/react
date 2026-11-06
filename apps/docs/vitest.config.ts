import { defineConfig } from "vitest/config"
export default defineConfig({
  root: import.meta.dirname,
  test: {
    name: "docs",
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
  },
})
