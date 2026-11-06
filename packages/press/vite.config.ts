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
    target: "node24",
    minify: false,
    sourcemap: true,
    lib: {
      entry: {
        index: "src/index.ts",
        "content/index": "src/content/index.ts",
        "node/index": "src/node/index.ts",
        "node/cli": "src/node/cli.ts",
        "vite/index": "src/vite/index.ts",
        "site/index": "src/site/index.ts",
        "react/index": "src/react/index.ts",
      },
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
