---
eyebrow: Tooling / Press
description: Create, develop and build your first YuPress site.
---

# Getting started

Use Node 24 or 26. After npm publication, install the core, a theme and their host dependencies:

```sh
pnpm add @yuzur1ha/press @yuzur1ha/press-theme react react-dom react-router vite @emotion/react
```

Before publication, use the built workspace packages. Create `yupress.config.ts` at the project root:

```ts
import { defineConfig } from "@yuzur1ha/press"

export default defineConfig({
  theme: "@yuzur1ha/press-theme",
  content: { srcDir: "content" },
  site: {
    title: "My manual",
    locales: [
      { id: "en", lang: "en", label: "English", sourceDir: "", prefix: "" },
    ],
    sections: [
      { id: "manual", label: "Manual", documents: ["index", "guide"] },
    ],
  },
})
```

Add `content/index.md` and `content/guide.md`, each with a leading H1, then run:

```sh
pnpm exec yupress dev --port 5173
pnpm exec yupress build
pnpm exec yupress preview --port 5173
```

The default content plugin derives titles, headings and directory-style routes. `index.md` maps to its directory; `guide.md` maps to `/guide/`. Published routes are prerendered into `dist/`, including readable document bodies before JavaScript runs. `preview` serves that output without needing the original content/configuration.

## CLI commands

- `generate`: compile, validate and write the generated content files.
- `check`: validate that generated files are current without repairing them.
- `watch`: regenerate managed content and report errors as dependencies change.
- `dev`: run the development site and content lifecycle.
- `build`: prerender and replace an owned static output directory; unrelated output is not silently overwritten.
- `preview`: serve the completed static output, including real 404 responses.

Common options are `--root` and `--config`. Site commands accept `--port`; `build` and `preview` also accept `--out-dir`. Unknown commands/options, invalid ports and unsafe output paths fail explicitly. No command means `generate`.

## Styles and fonts

The default theme installs its global styles and token variables. Fonts are opt-in: import `@yuzur1ha/token/fonts.css` once from a local `document` module when you want Instrument Sans and JetBrains Mono. Supply a custom theme or font tokens when using other fonts. See [themes](/press/theme/) for the document renderer contract.
