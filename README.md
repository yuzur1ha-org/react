<div align="center">

<img src="assets/wordmark.png" alt="Yuzur1ha OSS" width="560" />

[English](README.md) | [简体中文](README.zh-cn.md)

</div>

A frontend toolkit for consistent interfaces and documentation: design tokens, accessible React components, a standalone Markdown compiler and YuPress static sites.

**Status:** six runtime ESM packages and one shared build-tooling package at 0.1.0, available in this workspace. npm publication and the GitHub Pages site are pending. Installation commands below apply after the first publication; use the workspace for evaluation today.

## Features

- Share light/dark tokens between CSS and React, with optional fonts and scoped Markdown typography.
- Compose accessible controls with refs, keyboard interaction, portals and local themes.
- Compile Markdown at build time with metadata, source maps, trusted plugins and Vite transforms.
- Build static documentation with validated navigation, locales, automatic Shiki highlighting and code copying.
- Adopt the content services independently, or combine the default theme with Demo/API references.

## Choose a package

| Package | Use it for | Dependencies |
| --- | --- | --- |
| [`@yuzur1ha/token`](packages/token/README.md) | Design tokens, CSS, fonts and typography. | No React. |
| [`@yuzur1ha/ui`](packages/ui/README.md) | Accessible React components. | token; React/DOM/Emotion peers. |
| [`@yuzur1ha/markdown`](packages/markdown/README.md) | Single-document compilation and Vite transforms. | No Press or UI; React/Vite integrations optional. |
| [`@yuzur1ha/press`](packages/press/README.md) | Content services, CLI, SSG and unstyled React runtime. | markdown; no UI or default theme. |
| [`@yuzur1ha/press-theme`](packages/press-theme/README.md) | Default YuPress site layout and navigation. | press, ui, token. |
| [`@yuzur1ha/press-reference`](packages/press-reference/README.md) | Demo, source preview and schema/API tables. | press, ui, token; no default theme. |
| [`@yuzur1ha/shared`](packages/shared/README.md) | Shared Vite, declaration generation and strict TypeScript configuration. | Development tooling; Vite peer. |

Choose token for any frontend, UI for React applications, Markdown for an existing publishing pipeline, or Press for a complete content project. Theme and reference are optional adapters rather than core requirements.

## Installation and usage

Node 24 or 26 is supported. Packages are ESM-only; there is no CommonJS build. Host React 19, React DOM 19, Emotion 11, Vite 8 and React Router 8 as required by the selected package; see each manifest for exact peer ranges.

### Tokens

```sh
pnpm add @yuzur1ha/token
```

```ts
import { tokens, toCSSVariables } from "@yuzur1ha/token"
import "@yuzur1ha/token/css"

const variables = toCSSVariables(tokens)
```

The CSS entry installs light/dark variables. The JavaScript object does not load global styles. Fonts, Markdown CSS and HeroUI adapters are opt-in entries.

### React UI

```sh
pnpm add @yuzur1ha/ui @yuzur1ha/token react react-dom @emotion/react
```

```tsx
import { UIProvider, Button } from "@yuzur1ha/ui"
import "@yuzur1ha/token/fonts.css"

export function Example() {
  return (
    <UIProvider>
      <Button onClick={() => console.log("Saved")}>Save</Button>
    </UIProvider>
  )
}
```

Configure the automatic Emotion JSX runtime (`jsxImportSource: "@emotion/react"`) when authoring your own `css` props. UI owns scoped component styles; a provider can supply local token overrides. Consumers own labels, state and application translations.

### Markdown

```sh
pnpm add @yuzur1ha/markdown
```

```ts
import { compileDocument } from "@yuzur1ha/markdown/compiler"
import { staticHtml } from "@yuzur1ha/markdown/plugins"

const document = await compileDocument("# Hello", "hello.md", {
  analyze: () => ({ category: "guide" }),
  html: staticHtml,
})
console.log(document.code, document.metadata)
```

Compiler-only use needs no React runtime. Rendering generated modules requires React; Markdown source is not executable MDX. The HTML policy is a guard for trusted documentation, not a complete sanitizer for arbitrary untrusted input.

### YuPress

```sh
pnpm add @yuzur1ha/press @yuzur1ha/press-theme react react-dom react-router vite @emotion/react
```

```ts
// yupress.config.ts
import { defineConfig } from "@yuzur1ha/press"

export default defineConfig({
  theme: "@yuzur1ha/press-theme",
  content: { srcDir: "content" },
  code: { theme: "tokens", copy: true, lineNumbers: false },
  site: {
    title: "My manual",
    locales: [
      { id: "en", lang: "en", label: "English", sourceDir: "", prefix: "" },
    ],
    sections: [{ id: "manual", label: "Manual", documents: ["index"] }],
  },
})
```

Create `content/index.md` with `# Hello`, then run:

```sh
pnpm exec yupress dev
pnpm exec yupress build
pnpm exec yupress preview
```

Standard fenced code is highlighted during the build; no Shiki engine reaches the browser. The default theme installs token/global styles. Fonts remain optional; import the fonts entry once in a local document module. Set `site.base` for project hosting and verify the same base before deployment.

## Documentation

- [Markdown guide](apps/docs/src/content/markdown/index.md): compiler, plugins, Vite and typography.
- [YuPress guide](apps/docs/src/content/press/index.md): configuration, content projects, themes, code blocks and deployment.
- [Contributing](CONTRIBUTING.md): development and release requirements.

Run the local Docs site to follow route-based guide links. Public guides and package READMEs are English; Chinese site translations are in progress. Internal `.soppy/` review documents are Simplified Chinese.

## Development

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Use pnpm 11.18.0. Docs runs at http://127.0.0.1:5173.

| Command | Purpose |
| --- | --- |
| `pnpm check` | Build prerequisites, lint, types, contracts and formatting. |
| `pnpm build` | Build seven packages and the static Docs site. |
| `pnpm test:unit` | Package/application unit and script tests. |
| `pnpm test:e2e` | Development-site browser and content lifecycle checks. |
| `pnpm test:production` | Build and test production SSG/hydration. |

For package behavior changes, run `pnpm changeset`, select the affected packages and write an English summary. Independent versions and dependency propagation use Changesets; retain its generated README. GitHub Actions prepares version bumps and CHANGELOG files in a release PR; do not generate them locally. npm publication is separately gated.

## Limitations and status

This is an unreleased frontend toolkit. There are no backend services or hosted runtime requirements. The default compiler enables pipe tables rather than every GFM extension. Package publication, external CI, Windows checks and live Pages hosting must be verified separately from local checks; see the acceptance record for current evidence.

## License

[MIT](LICENSE). Third-party dependencies and resources retain their licenses; see [notices](THIRD_PARTY_NOTICES.md).
