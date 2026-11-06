# @yuzur1ha/press-reference

Optional documentation demos, API tables and source previews.

```sh
pnpm add @yuzur1ha/press-reference react react-dom @emotion/react
```

ESM; Node 24 or 26.

```tsx
import { ReferenceDocument } from "@yuzur1ha/press-reference"

export function Example() {
  return (
    <ReferenceDocument
      metadata={{ title: "Example", description: "A component reference." }}
      Content={() => <p>Document content</p>}
    />
  )
}
```

Exports `ReferenceDocument`, `Demo`, `Schema`, API types and metadata formatting helpers. Compose it in a document renderer; it does not depend on the default Press theme.

Demo accepts optional precompiled `code` from `ProjectContext.highlightCode(source, "tsx")`. Plain source remains a supported fallback. Both paths use the shared UI CodePanel and core copy lifecycle; there is no browser syntax highlighter.

[Documentation](../../apps/docs/src/content/press/index.md) · [Third-party notices](THIRD_PARTY_NOTICES.md) · [MIT license](LICENSE)
