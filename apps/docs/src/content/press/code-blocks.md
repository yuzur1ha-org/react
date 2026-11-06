---
eyebrow: Tooling / Press
description: Build-time syntax highlighting and copying using standard Markdown.
---

# Code blocks

Write an ordinary fenced code block with a language, or an indented block. YuPress handles it automatically, including inside lists and quotations. No directive, app-level highlighter or client grammar bundle is needed.

```ts
const greeting = "Hello, YuPress"
console.log(greeting)
```

## Defaults

Shiki runs only during Node compilation. The default `tokens` theme maps syntax categories to the existing light/dark design tokens. Ordinary blocks have no line numbers; Demo source keeps them. Both share a scrollable panel, fixed-size copy button and accessible success/failure feedback. Demo keeps its filename and collapsible shell; ordinary blocks remain expanded.

## Configuration

```ts
import { defineConfig } from "@yuzur1ha/press"

export default defineConfig({
  code: {
    highlight: true,
    theme: "tokens",
    copy: true,
    lineNumbers: false,
    languages: ["typescript", "tsx", "json", "bash"],
  },
})
```

- `highlight: false`: plain code in the same panel, with copying available.
- `copy: false`: no copy controls in ordinary blocks or precompiled Demo source.
- `lineNumbers: true`: enable ordinary block line numbers; Demo keeps its established line numbers.
- `theme: { light: "github-light", dark: "github-dark" }`: select bundled Shiki themes. Unknown configured themes fail early.
- `languages`: optional allowlist using Shiki's bundled names/aliases. Omit it to load grammars lazily from actual blocks. Invalid configured languages are errors.
- `code: false`: preserve ordinary Markdown rendering and skip the framework panel/highlighting. Demo retains its shell and plain source, without copy controls.

No language, a disallowed language or `text` renders plain text. Unknown block languages also emit a build warning instead of dropping the code. Language names are not remote module URLs. Fence metadata is not executed and does not introduce filename or line-highlighting syntax.

## Copy behavior

Copy uses the Markdown parser's code body, without fences, added trailing newlines or line numbers. Demo copies the original file string. Content is never reconstructed from syntax-token DOM and is not trimmed. Successful feedback resets after two seconds. Clipboard denial or an unavailable API shows the existing retry/fallback message; selecting the text remains possible. Copy requires JavaScript and a browser clipboard context, while reading and highlighting work without JavaScript.

## Boundaries

Inline code and authored HTML `pre` are unchanged. HTML policy validation runs before component replacement. Tokens become React text nodes, not injected HTML. Custom content plugins use [the project compilation service](/press/content/#shared-compilation-service) to inherit these defaults; plugins that deliberately invoke the standalone Markdown compiler own their own rendering.
