---
eyebrow: Tooling / Markdown
description: Extend syntax and render standard elements without site coupling.
---

# Plugins and extensions

Register a directive and provide its React component beside the document:

```ts
import type { CompilerOptions } from "@yuzur1ha/markdown/compiler"

const options: CompilerOptions<Record<string, never>> = {
  analyze: () => ({}),
  directives: {
    notice: {
      kind: "leafDirective",
      render(node) {
        return {
          component: { from: "./notice.tsx", name: "Notice" },
          props: { label: node.attributes.label ?? "Note" },
        }
      },
    },
  },
}
```

```text
::notice{label="Read this first"}
```

The `Notice` component and module path are consumer-owned. Hosts should normalize tracked resource paths for their project/watch environment. `context.import(reference)` creates a binding when a prop must refer to a module export; `context.expression(value)` converts supported values into the output expression. Ordinary props must be serializable values. Unsupported instances, cyclic values, accessors and non-finite numbers are rejected instead of silently changing meaning.

## Standard element renderers

`elementRenderers` maps an HTML element name to an asynchronous renderer. Return a component reference, serializable props and optional replacement `children`, or `undefined` to preserve the element. Children are processed recursively before their parent. The original source position stays attached to the generated component.

```ts
const options = {
  analyze: () => ({}),
  elementRenderers: {
    blockquote(element) {
      return {
        component: { from: "./quote.tsx", name: "Quote" },
        children: element.children,
      }
    },
  },
}
```

HTML validation runs on the original elements before replacement. Application analysis runs before lowering, so wrappers introduced by analysis are traversed too. Treat renderers and plugins as trusted build code. They do not make authored JSX executable or bypass the HTML policy.

The compiler identifies ordinary Markdown code and tables in HAST `data.markdownCode` and `data.markdownTable`. `markdownCode` contains the parser's original code body without an artificially appended newline. Raw HTML `pre` is not marked. Hosts such as YuPress use these markers to enhance standard syntax without inventing directives.

`remarkPlugins` operate on Markdown AST; `rehypePlugins` operate on HTML AST. `handlers` override Markdown-to-HTML conversion. A custom handler owns any data markers it replaces. Compiler plugins do not discover project files or configure site navigation.
