import { libraryConfig } from "@yuzur1ha/shared/vite"
import manifest from "./package.json" with { type: "json" }
export default libraryConfig({
  root: import.meta.dirname,
  manifest,
  target: "es2022",
  entry: { index: "src/index.tsx" },
})
