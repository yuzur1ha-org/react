# @yuzur1ha/token

Framework-independent design tokens, light/dark themes and CSS adapters.

```sh
pnpm add @yuzur1ha/token
```

ESM; Node 24 or 26.

```ts
import { tokens, toCSSVariables } from "@yuzur1ha/token"
import "@yuzur1ha/token/css"

const variables = toCSSVariables(tokens)
```

CSS, fonts, Markdown typography and HeroUI adapters are opt-in exports. This package does not depend on React.

[Documentation](../../apps/docs/src/content/ui/foundations/index.md) · [Third-party notices](THIRD_PARTY_NOTICES.md) · [MIT license](LICENSE)
