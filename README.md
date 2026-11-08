<div align="center">

<img src="assets/wordmark.png" alt="Yuzur1ha OSS" width="560" />

[![YuPress on npm](https://img.shields.io/npm/v/%40yuzur1ha%2Fpress?label=YuPress)](https://www.npmjs.com/package/@yuzur1ha/press) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6)

[English](README.md) | [简体中文](README.zh-cn.md)

</div>

Yuzur1ha is a collection of React UI components and tools for publishing documentation. Use the design tokens or individual controls in an existing app, or build a static site from Markdown guides and component demos with YuPress.

## Quick start

Use Node.js 24 or 26. To add a control to a React application, install the UI package and its runtime dependencies.

```sh
pnpm add @yuzur1ha/ui @yuzur1ha/token react react-dom @emotion/react
```

```tsx
import { Button, UIProvider } from "@yuzur1ha/ui"

export function Example() {
  return (
    <UIProvider>
      <Button>Continue</Button>
    </UIProvider>
  )
}
```

## Packages

| Package | Use it for | Dependencies |
| --- | --- | --- |
| [`@yuzur1ha/token`](packages/token/README.md) | Design tokens, CSS, fonts and typography. | No React. |
| [`@yuzur1ha/ui`](packages/ui/README.md) | Accessible React components. | token; React/DOM/Emotion peers. |
| [`@yuzur1ha/markdown`](packages/markdown/README.md) | Single-document compilation and Vite transforms. | No Press or UI; React/Vite integrations optional. |
| [`@yuzur1ha/press`](packages/press/README.md) | Content services, CLI, SSG and unstyled React runtime. | markdown; no UI or default theme. |
| [`@yuzur1ha/press-theme`](packages/press-theme/README.md) | Default YuPress site layout and navigation. | press, ui, token. |
| [`@yuzur1ha/press-reference`](packages/press-reference/README.md) | Demo, source preview and schema/API tables. | press, ui, token; no default theme. |
| [`@yuzur1ha/shared`](packages/shared/README.md) | Shared Vite, declaration generation and strict TypeScript configuration. | Development tooling; Vite peer. |

## Documentation

- [Create a YuPress site](apps/docs/src/content/press/getting-started.md)
- [Compile Markdown in an existing project](apps/docs/src/content/markdown/getting-started.md)
- [Development and contributing](CONTRIBUTING.md)
- [Package releases](https://github.com/yuzur1ha-org/react/releases)

## License

[MIT](LICENSE). Third-party dependencies and resources retain their licenses; see [notices](THIRD_PARTY_NOTICES.md).
