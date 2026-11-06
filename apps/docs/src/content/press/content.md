---
eyebrow: Tooling / Press
description: Reuse project discovery, compilation and content lifecycle.
---

# Content projects and plugins

- Root: `defineConfig` and configuration/plugin types.
- `/content`: pure content models, routes, translation lookup, headings, messages and section validation. It has no Node, React or theme runtime dependency.
- `/node`: configuration, discovery, project analysis, generation, emission and watching.
- `/vite`: `createDocumentation` for content integration in another Vite application.
- `/site`: `buildSite`, `devSite`, `previewSite` and site Vite integration.
- `/react`: shared contexts, `defineDocument`, document props and the `ThemeModule` contract. Visual components live in the separate theme/reference packages.

## Content plugins

```ts
import type { YuPressPlugin } from "@yuzur1ha/press"

const requireTitles: YuPressPlugin = {
  name: "manual:require-titles",
  setup() {
    return {
      validate(documents) {
        if (!documents.length) throw new Error("Add at least one document")
      },
    }
  },
}
```

`setup(context)` creates one content session. The project context exposes source identities and tracked `read`, `readBytes`, `json`, `files` and resolution helpers, plus `compileDocument` and `highlightCode`. Returned hooks can provide a `content` compiler, `transformDocument`, `validate` and `dispose`. Compiler `test(path)` claims matching sources; multiple claimants are errors, and unclaimed documents use the default Markdown compiler. Cleanup runs when the session ends, including failures. Top-level `buildEnd(result)` runs after a successful static output is produced.

Keep metadata schemas, publication rules, demo/schema validation and application resource policies in the consuming project. Do not create a second watcher or a second source inventory inside a content plugin.

## Shared compilation service

Custom content compilers should call `context.compileDocument(source, path, options)` instead of calling Markdown directly. The generic options and metadata result match `@yuzur1ha/markdown/compiler`; YuPress adds ordinary code/table rendering after your analysis and HTML policy. Nested prose wrappers remain supported.

For Demo source, call `await context.highlightCode(source, "tsx")` and pass the resulting serializable `code` alongside `source` to Reference's `Demo`. This reuses the project highlighter, obeys the site's copy/theme configuration and needs no client highlighter registration. Read files through the tracked project helpers so edits trigger regeneration.

Highlighters are created lazily, reused within one analysis session and disposed even on failure. Watching starts a fresh session when dependencies or configuration change; no separate persistent syntax cache is written.

## Headless Vite integration

```ts
import { defineConfig } from "vite"
import { createDocumentation } from "@yuzur1ha/press/vite"

const manual = createDocumentation({ namespace: "manual" })

export default defineConfig({
  plugins: manual.plugins({ markdown: true, content: true, sidebar: false }),
})
```

This reuses the project snapshot, compiler output and dependency tracking without adopting the default site. It exposes a `virtual:manual` manifest and optionally `virtual:manual/sidebar`. Applications own the corresponding virtual-module declarations and page composition. `configFile` can select another project configuration.
