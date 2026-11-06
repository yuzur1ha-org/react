import { libraryConfig } from "@yuzur1ha/shared/vite"
import manifest from "./package.json" with { type: "json" }
export default libraryConfig({
  root: import.meta.dirname,
  manifest,
  target: "es2022",
  entry: {
    index: "src/index.ts",
    "content/index": "src/content/index.ts",
    "node/index": "src/node/index.ts",
    "node/cli": "src/node/cli.ts",
    "vite/index": "src/vite/index.ts",
    "site/index": "src/site/index.ts",
    "react/index": "src/react/index.ts",
  },
})
