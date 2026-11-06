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
      entry: {
        index: "src/index.ts",
        accordion: "src/components/accordion/index.ts",
        avatar: "src/components/avatar/index.ts",
        badge: "src/components/badge/index.ts",
        "code-panel": "src/components/code-panel/index.ts",
        button: "src/components/button/index.ts",
        checkbox: "src/components/checkbox/index.ts",
        "close-button": "src/components/close-button/index.ts",
        disclosure: "src/components/disclosure/index.ts",
        drawer: "src/components/drawer/index.ts",
        form: "src/components/form/index.ts",
        input: "src/components/input/index.ts",
        "input-otp": "src/components/input-otp/index.ts",
        link: "src/components/link/index.ts",
        menu: "src/components/menu/index.ts",
        meter: "src/components/meter/index.ts",
        modal: "src/components/modal/index.ts",
        "number-field": "src/components/number-field/index.ts",
        popover: "src/components/popover/index.ts",
        radio: "src/components/radio/index.ts",
        "scroll-area": "src/components/scroll-area/index.ts",
        segmented: "src/components/segmented/index.ts",
        select: "src/components/select/index.ts",
        "setting-row": "src/components/setting-row/index.ts",
        switch: "src/components/switch/index.ts",
        "text-field": "src/components/text-field/index.ts",
        textarea: "src/components/textarea/index.ts",
        toast: "src/components/toast/index.ts",
        tooltip: "src/components/tooltip/index.ts",
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
