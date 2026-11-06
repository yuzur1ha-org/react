---
eyebrow: Tooling / Markdown
description: Transform Markdown modules and declare their React types.
---

# Vite integration

```ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { createMarkdownPlugin } from "@yuzur1ha/markdown/vite"

export default defineConfig({
  plugins: [createMarkdownPlugin(), react()],
})
```

Import a document as a component, for example `import Guide from "./guide.md"`. The plugin transforms plain `.md` requests; query imports such as `?raw` remain available to the host bundler. `compiler` accepts compiler options. `resolveCompiled(id)` lets a project supply an existing result; when a resolver is supplied and returns nothing, the plugin does not recompile that document. Returned dependencies are registered with Vite and source maps are preserved.

Use [Press](/press/) when you need project discovery, generated manifests, navigation validation, watching or a static documentation site.

## TypeScript and component overrides

Add this reference to an included declaration file:

```ts
/// <reference types="@yuzur1ha/markdown/client" />
```

The type-only `/client` entry declares plain `*.md` default exports as React components with optional typed `components` overrides. It has no JavaScript runtime. Install the React type declarations when using TypeScript; keep `vite/client` separately if the application uses Vite query/resource types. A Node compiler import does not implicitly enable the Markdown module shim.
