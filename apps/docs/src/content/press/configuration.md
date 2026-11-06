---
eyebrow: Tooling / Press
description: Configure sources, navigation, themes and code blocks.
---

# Configuration

`defineConfig` accepts an object or an asynchronous factory receiving `root` and `command`. Configuration is discovered from root `yupress.config.ts` or `.mts`; use `--config` for another file. Multiple discovered config files are an error.

- `content.srcDir`, `include` and `exclude` control the source inventory.
- `content.metadataType` names an application type for generated metadata declarations.
- `content.publish(document)` selects the published collection after inventory validation.
- `site` owns title, locales, base, sections, links, home presets and footer content.
- `theme` names a full theme package or an explicit local `./theme.tsx` module.
- `document` optionally selects a local document renderer relative to the project root.
- `plugins` contains content lifecycle extensions; `vite` accepts Vite options or an asynchronous options factory.
- `outputDir` controls generated content cache output, defaulting to `.cache/press`; it is separate from the public site output selected with `--out-dir`.

Do not commit `.cache/press/` or `dist/`. The cache contains generated manifests, loaders, metadata and build intermediates. Recreate it with `generate` rather than editing generated files.

## Code blocks

```ts
export default defineConfig({
  theme: "@yuzur1ha/press-theme",
  code: {
    highlight: true,
    theme: "tokens",
    copy: true,
    lineNumbers: false,
    // languages: ["typescript", "tsx", "json", "bash"],
  },
})
```

All fields are optional. `code: false` disables code enhancement. See [code blocks](/press/code-blocks/) for language fallbacks and built-in light/dark themes.

## Locales and navigation

Declare language source directories and URL prefixes in `site.locales`. Document IDs connect translations; the default theme falls back to the target language home and shows a notice when a translation is missing. Locale UI messages and home presets are consumer configuration, not a shared application catalog.

`site.sections` declares document order and groups against the validated inventory. Duplicate, missing or conflicting references are errors; navigation does not discover extra content. Use `site.home` or locale-specific home presets to combine Markdown content with hero/features.

Site sections list document IDs (without `.md`) in reading order. For example `content/guide/setup.md` has ID `guide/setup`; `content/index.md` has ID `index`. A locale source prefix is removed before assigning IDs. Groups reference that same inventory; no extra discovery occurs during rendering.
