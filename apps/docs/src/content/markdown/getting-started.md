---
eyebrow: Tooling / Markdown
description: Compile one document and render the generated React module.
---

# Getting started

Use Node 24 or 26. Install the compiler with `pnpm add @yuzur1ha/markdown`. Compiler-only projects do not need React, Vite, Press or UI. To render the generated modules, provide React and React DOM; Vite integration also needs a compatible Vite installation.

## Compile a document

```ts
import { compileDocument } from "@yuzur1ha/markdown/compiler"
import { remarkTables, staticHtml } from "@yuzur1ha/markdown/plugins"

const result = await compileDocument(
  "# Hello\n\nA **small** document.",
  "content/hello.md",
  {
    analyze: () => ({ category: "guide" }),
    remarkPlugins: [remarkTables],
    html: staticHtml,
  },
)

console.log(result.code, result.metadata)
```

`compileDocument` is asynchronous. Its result includes React ESM `code`, a source `map`, application `metadata`, raw `frontmatter`, optional frontmatter source/position, and `dependencies`. The compiler receives source text and a file identity; it does not discover files, read the filesystem, create navigation or write a site.

`analyze(tree, context)` receives the parsed HAST and controls metadata. Use the optional `consumeTitle` helper to remove a leading H1 and return it as a title when a surrounding document renderer owns that heading. Frontmatter is parsed as YAML and remains available through `context.frontmatter`; `readMetadata` can validate selected fields and apply fallbacks. Unknown fields remain in the raw frontmatter rather than automatically becoming public metadata. Invalid supplied values must be handled explicitly.

Next, connect the [Vite plugin](/markdown/vite/) or inspect the [compiler contract](/markdown/compiler/).
