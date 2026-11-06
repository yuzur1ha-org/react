# Third-party notices

Project source is distributed under the [MIT license](LICENSE). The toolkit was migrated from the author's yuzur1ha repository. The wordmark, brand-y.svg and favicon.svg are used by this repository and its Docs site; they are not distributed as a separate npm asset package.

Fonts are referenced through `@fontsource-variable/instrument-sans` and `@fontsource-variable/jetbrains-mono`. The static Docs build distributes their original [Instrument Sans OFL](apps/docs/licenses/instrument-sans.txt) and [JetBrains Mono OFL](apps/docs/licenses/jetbrains-mono.txt) texts under `/licenses/`. Each font retains its copyright and SIL Open Font License.

External packages, including React, Emotion, Radix, Lucide, MDX/unified, Vite and React Router, retain their respective licenses. `scripts/license-inventory.mjs` records installed direct dependency metadata in [docs/dependencies.json](docs/dependencies.json). This inventory is not a complete transitive dependency license audit; review the licenses shipped with dependencies before release.

Figma links identify design references and do not grant trademark or third-party asset rights.

## Syntax highlighting

YuPress uses Shiki 4.6.0 (MIT) during Node compilation. Shiki bundles grammar and theme definitions with their own attribution; the dependency retains its notices. Highlighted text is serialized into the site, without shipping the highlighter engine or grammar modules to browsers. Prism is no longer used.
