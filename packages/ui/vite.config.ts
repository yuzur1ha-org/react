import { defineConfig } from "vite"
import { libraryConfig } from "@yuzur1ha/shared/vite"
import manifest from "./package.json" with { type: "json" }
const components = Object.freeze([
  "accordion",
  "avatar",
  "badge",
  "button",
  "checkbox",
  "close-button",
  "code-panel",
  "disclosure",
  "drawer",
  "form",
  "input",
  "input-otp",
  "link",
  "menu",
  "meter",
  "modal",
  "number-field",
  "popover",
  "radio",
  "scroll-area",
  "segmented",
  "select",
  "setting-row",
  "switch",
  "text-field",
  "textarea",
  "toast",
  "tooltip",
])
const entry = {
  index: "src/index.ts",
  ...Object.fromEntries(
    components.map((name) => [
      `entries/${name}`,
      `src/components/${name}/index.ts`,
    ]),
  ),
}

export default defineConfig({
  ...libraryConfig({
    root: import.meta.dirname,
    manifest,
    target: "es2022",
    entry,
  }),
  plugins: [
    {
      name: "ui-public-declarations",
      generateBundle() {
        for (const name of components)
          this.emitFile({
            type: "asset",
            fileName: `entries/${name}.d.ts`,
            source: `export * from "../components/${name}/index.js"\n`,
          })
      },
    },
  ],
})
