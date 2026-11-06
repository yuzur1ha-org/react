import { defineConfig } from "vite"
import { builtinModules } from "node:module"
import manifest from "./package.json" with { type: "json" }
const dependencies = [
  ...Object.keys(manifest.dependencies),
  ...("peerDependencies" in manifest &&
  manifest.peerDependencies &&
  typeof manifest.peerDependencies === "object"
    ? Object.keys(manifest.peerDependencies)
    : []),
  "vite",
]
export default defineConfig({
  root: import.meta.dirname,
  build: {
    target: "es2022",
    minify: false,
    sourcemap: true,
    lib: {
      entry: { index: "src/index.tsx" },
      formats: ["es"],
      fileName: (_format, name) => `${name}.js`,
    },
    rolldownOptions: {
      external: (id) =>
        id.startsWith("node:") ||
        builtinModules.includes(id) ||
        dependencies.some((name) => id === name || id.startsWith(`${name}/`)),
      output: { chunkFileNames: "chunks/[name]-[hash].js" },
    },
  },
})
