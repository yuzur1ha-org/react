---
eyebrow: Tooling / Press
description: Customize the site independently of the core content services.
---

# Themes and document renderers

The core does not install a visual theme implicitly. A complete theme implements `ThemeModule`: `SiteRoot`, `DocumentPage`, `SiteHomePage`, `DocumentFailure`, `DocumentBoundary`, `DocumentLoading` and `NotFound`. A custom theme can consume `/react` contexts without installing the default theme, UI or reference package.

Use `document` to change the body renderer while keeping a theme:

```tsx
import { defineDocument } from "@yuzur1ha/press/react"

export default defineDocument<{ title: string }>({
  Document({ metadata, Content }) {
    return (
      <article>
        <h1>{metadata.title}</h1>
        <Content />
      </article>
    )
  },
})
```

Point `document` at that local module. For component references, compose `ReferenceDocument` from `@yuzur1ha/press-reference` in the renderer. Runtime modules stay separate from Node configuration and compiler services; do not import build-only APIs into a browser component.

## Code block views

`ThemeModule` optionally exports `CodeBlockView: ComponentType<CodeBlockViewProps>`. Generated site roots install that view automatically. The default theme delegates to UI's `CodePanel`; custom themes may render `children`, copy state, labels and callbacks differently. The core owns clipboard behavior and timers. Do not register `CodeBlock` itself as its view, which would recurse.

If no view is exported, core renders semantic `pre`/`code` and an accessible copy button without UI, Emotion or the default theme. The complete highlighted body is included in static HTML. `CodeBlockProvider` lets headless React consumers install a view explicitly. `CodeBlock` also accepts a local `view` override.

Reference's Demo explicitly adapts the same UI panel and can run without a default-theme provider. UI does not import Press types. Shiki is never imported by any browser renderer.
