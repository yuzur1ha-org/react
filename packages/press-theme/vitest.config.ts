import { defineConfig } from "vitest/config"
export default defineConfig({
  root: import.meta.dirname,
  test: {
    name: "press-theme",
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
})
