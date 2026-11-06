# @yuzur1ha/shared

Shared Node.js build configuration for Yuzur1ha packages. Use it as a development dependency; it has no browser runtime entry. Requires Node 24 or 26 and Vite 8.3.5 or later within Vite 8 as a host peer. This package has not been published yet.

```ts
import { libraryConfig } from "@yuzur1ha/shared/vite"
import manifest from "./package.json" with { type: "json" }

export default libraryConfig({
  root: import.meta.dirname,
  entry: { index: "src/index.ts" },
  target: "es2022",
  manifest,
})
```

`libraryConfig` emits unminified ESM with source maps and separate chunks. It externalizes Node built-ins and declared dependencies, optional dependencies and peers, including their subpaths. Entry selection and syntax targets belong to the consuming package; development dependencies are not automatically externalized. The exported `LibraryConfigOptions` type describes this contract.

Use the portable strict TypeScript defaults through the exported JSON config:

```json
{
  "extends": "@yuzur1ha/shared/tsconfig/base.json",
  "compilerOptions": {
    "lib": ["ES2022", "DOM"],
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

Set environment-specific libraries, types and JSX locally. Declaration emit settings and paths also stay local, since TypeScript resolves relative config paths against the file that declares them. Override `skipLibCheck` to `false` when validating installed public declarations.

The package bootstraps with `tsc` rather than depending on its own Vite helper. Workspace dependency ordering builds it before the packages that use its public exports. Root `pnpm build:packages`, `pnpm check` and `pnpm test:unit` prepare it; run `pnpm --filter @yuzur1ha/shared build` before loading a package Vite config manually in a clean checkout.

## Declaration builds

Install TypeScript 5.9.3 or a compatible TypeScript 5 release alongside this package when using declaration generation. The optional TypeScript peer is not required by the Vite helper alone.

```sh
yu-build-declarations --config tsconfig.build.json --out-dir dist
# Ambient inputs are explicit and use source=output-path mappings.
yu-build-declarations --shim src/client.ts=client.d.ts
```

The CLI invokes TypeScript for declarations, then normalizes local module specifiers to Node-resolvable JavaScript paths. Configure `noEmit: false`, `declaration: true` and a package-local `rootDir` in the selected build config. It never scans source folders to choose public exports or silently copies shims.

`@yuzur1ha/shared/declarations` also exports `buildDeclarations`, `DeclarationBuildOptions`, `rewriteDeclaration` and `declarationSpecifier`. The build API accepts `root`, `config`, `outDir`, `temporaryDir` and explicit `shims: [{ source, target }]`. Relative paths resolve from `root` (default: the current directory); the default temporary folder is `.cache/declarations`.
