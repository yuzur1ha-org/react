# @yuzur1ha/markdown

Compile individual Markdown files into React ESM at build time.

```sh
pnpm add @yuzur1ha/markdown
```

ESM; Node 24 or 26.

```ts
import { compileDocument } from "@yuzur1ha/markdown/compiler"

const result = await compileDocument("# Hello", "hello.md", {
  analyze: () => ({}),
})
console.log(result.code)
```

Exports include `/compiler`, `/plugins`, `/vite` and the type-only `/client` shim. React and Vite are optional peers; compiler-only use needs neither. Project discovery and static sites belong to Press.

`elementRenderers` replaces standard HTML elements with trusted components after analysis, preserving children and source positions. It does not install Shiki or a site runtime.

[Documentation](../../apps/docs/src/content/markdown/index.md) · [Third-party notices](THIRD_PARTY_NOTICES.md) · [MIT license](LICENSE)
