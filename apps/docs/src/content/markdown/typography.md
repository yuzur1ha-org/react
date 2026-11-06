---
eyebrow: Tooling / Markdown
description: Scoped prose, GFM tables and code presentation.
---

# Typography

The optional `@yuzur1ha/token/markdown.css` stylesheet gives generated HTML a shared typographic language. Add `yu-markdown` to the prose container and use `data-markdown="gfm"`. Colors inherit the current light or dark tokens.

## Deliberate hierarchy

Paragraphs keep a comfortable measure. **Emphasis stays precise**, _secondary emphasis stays quiet_, and <del>retired wording</del> remains legible. Inline code such as `compileDocument()` sits on the same baseline; use <kbd>⌘</kbd> + <kbd>K</kbd> for keyboard instructions.

> Good documentation leaves room to read. A clear hierarchy is more useful than decoration.
>
> The same rules apply in light and dark themes.

1. Choose a heading that describes the section.
2. Keep related details together.
   - Preserve nesting and list markers.
   - Keep links [meaningful](/markdown/typography/#deliberate-hierarchy).
3. Show the smallest complete example.

<ul class="contains-task-list">
<li class="task-list-item"><input type="checkbox" checked disabled aria-label="Shared typography complete" /> Shared typography</li>
<li class="task-list-item"><input type="checkbox" disabled aria-label="Additional dialects pending" /> Additional dialects</li>
</ul>

| Surface |          Purpose          |                       Behavior |
| :------ | :-----------------------: | -----------------------------: |
| Paper   |          Reading          |           Theme-aware contrast |
| Subtle  | Code and tabular headings |               Quiet separation |
| Ink     |       Primary text        | Shared black and white palette |

```ts
import { markdownStyles } from "@yuzur1ha/token/markdown"

// Supply the stylesheet once; the class limits its scope.
const proseClass = "yu-markdown"
```

<details>
<summary>HTML output and compiler boundaries</summary>
<p>This is a style kit for generated HTML. It does not parse Markdown or enable extra compiler plugins. GFM task-list and deletion markup shown here is authored HTML; the current Docs compiler enables pipe tables.</p>
</details>

---

The stylesheet covers headings, paragraphs, lists, links, quotations, code, tables, tasks, media, details and footnotes without a global reset.

## Tables and code in YuPress

Tables use the same token-based row separators, spacing and code typography as API reference tables. Markdown's left, center and right column alignment remains intact. YuPress wraps Markdown tables in a keyboard-focusable horizontal region; the standalone stylesheet also handles overflow without React.

YuPress enhances standard fenced and indented blocks at build time. See [code blocks](/press/code-blocks/) for highlighting, copying, line numbers and plain-text fallbacks. The Markdown compiler itself does not depend on Shiki or install visual components.
