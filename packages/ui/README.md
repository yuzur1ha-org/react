# @yuzur1ha/ui

Accessible React components with scoped themes and explicit component entry points.

```sh
pnpm add @yuzur1ha/ui @yuzur1ha/token react react-dom @emotion/react
```

ESM; Node 24 or 26. Version 0.1.0 is prepared locally and has not been published to npm.

```tsx
import { Button, UIProvider } from "@yuzur1ha/ui"
import { tokens } from "@yuzur1ha/token"

export function Example() {
  return (
    <UIProvider theme={tokens}>
      <Button>Continue</Button>
    </UIProvider>
  )
}
```

React, React DOM and Emotion are host peers. Import individual components from paths such as `@yuzur1ha/ui/button`; labels and application state belong to the consumer.

`/code-panel` exports a presentation-only CodePanel. Consumers supply rendered code, copy state, labels and callbacks; no compiler or clipboard service is installed by UI.

[Documentation](../../apps/docs/src/content/components/button/index.md) · [Third-party notices](THIRD_PARTY_NOTICES.md) · [MIT license](LICENSE)
