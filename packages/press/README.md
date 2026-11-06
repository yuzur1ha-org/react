# @yuzur1ha/press

Content project services, Vite integration and static documentation builds.

```sh
pnpm add @yuzur1ha/press @yuzur1ha/press-theme react react-dom react-router vite @emotion/react
```

ESM; Node 24 or 26. Version 0.1.0 is prepared locally and has not been published to npm.

```ts
import { defineConfig } from "@yuzur1ha/press"

export default defineConfig({
  theme: "@yuzur1ha/press-theme",
  site: {
    title: "My docs",
    locales: [
      { id: "en", lang: "en", label: "English", sourceDir: "", prefix: "" },
    ],
  },
})
```

The `yupress` CLI provides `generate`, `check`, `watch`, `dev`, `build` and `preview`. Public subpaths are `/content`, `/node`, `/vite`, `/site` and `/react`. The core does not depend on UI, Emotion or a default theme.

Standard Markdown blocks are highlighted with Shiki during Node compilation. Configure `code` in yupress.config.ts; custom content compilers inherit it through `ProjectContext.compileDocument`. `/react` provides CodeBlock, CodeBlockProvider and an optional theme CodeBlockView contract.

[Documentation](../../apps/docs/src/content/press/index.md) · [Third-party notices](THIRD_PARTY_NOTICES.md) · [MIT license](LICENSE)
