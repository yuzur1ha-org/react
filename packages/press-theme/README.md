# @yuzur1ha/press-theme

The optional default React theme for YuPress documentation.

```sh
pnpm add @yuzur1ha/press-theme react react-dom react-router @emotion/react
```

ESM; Node 24 or 26.

```tsx
import type { ThemeModule } from "@yuzur1ha/press/react"
import * as theme from "@yuzur1ha/press-theme"

const checked: ThemeModule = theme
export default checked
```

Provides the site layout, navigation, document shell, home page, loading states and error boundaries. Select it with `theme: "@yuzur1ha/press-theme"`; custom document rendering uses the separate `document` option.

[Documentation](../../apps/docs/src/content/press/index.md) · [Third-party notices](THIRD_PARTY_NOTICES.md) · [MIT license](LICENSE)
