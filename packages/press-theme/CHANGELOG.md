# @yuzur1ha/press-theme

## 0.2.0

### Minor Changes

- [#1](https://github.com/yuzur1ha-org/react/pull/1) [`eeb3df7`](https://github.com/yuzur1ha-org/react/commit/eeb3df77bdfcf608e520cb82b7443035e4f2a871) Thanks [@soppylzz](https://github.com/soppylzz)! - Add build-time Shiki highlighting, standard Markdown element renderers and shared accessible code panels with clipboard feedback. Expose code configuration and project compilation services; migrate Demo previews from Prism to precompiled tokens.

  Unify GFM/API table styling and responsive viewport tiers, stabilize Press navigation typography, and split the Markdown/YuPress guides. Custom content compilers should use ProjectContext.compileDocument and precompile Demo source through highlightCode. Themes may optionally export CodeBlockView; core retains an unstyled fallback.

  Keep the brand inset at 32px across tablet and desktop layouts, independently of the responsive header-control inset.

  Reserve a fixed 180px brand link content width across viewport tiers, prevent flex shrinking during resize, and truncate long site titles within the reserved space.

### Patch Changes

- [#1](https://github.com/yuzur1ha-org/react/pull/1) [`fc77ddf`](https://github.com/yuzur1ha-org/react/commit/fc77ddffb58cc5de7ae6dc07b0df2fe644e56ad1) Thanks [@soppylzz](https://github.com/soppylzz)! - Share explicit ESM library build configuration and preserve overridable Press layout dimensions.

- [#1](https://github.com/yuzur1ha-org/react/pull/1) [`fc77ddf`](https://github.com/yuzur1ha-org/react/commit/fc77ddffb58cc5de7ae6dc07b0df2fe644e56ad1) Thanks [@soppylzz](https://github.com/soppylzz)! - Add shared Vite library configuration and portable strict TypeScript defaults as a development-only tooling package.

- [#1](https://github.com/yuzur1ha-org/react/pull/1) [`fc77ddf`](https://github.com/yuzur1ha-org/react/commit/fc77ddffb58cc5de7ae6dc07b0df2fe644e56ad1) Thanks [@soppylzz](https://github.com/soppylzz)! - Add optional ScrollArea contentClassName and MenuDisclosure scrollContentClassName slots to avoid depending on private viewport markup.

- [#1](https://github.com/yuzur1ha-org/react/pull/1) [`fc77ddf`](https://github.com/yuzur1ha-org/react/commit/fc77ddffb58cc5de7ae6dc07b0df2fe644e56ad1) Thanks [@soppylzz](https://github.com/soppylzz)! - Expose shared declaration generation with explicit shim configuration and remove repository-relative build commands.
- Updated dependencies [[`fc77ddf`](https://github.com/yuzur1ha-org/react/commit/fc77ddffb58cc5de7ae6dc07b0df2fe644e56ad1), [`fc77ddf`](https://github.com/yuzur1ha-org/react/commit/fc77ddffb58cc5de7ae6dc07b0df2fe644e56ad1), [`eeb3df7`](https://github.com/yuzur1ha-org/react/commit/eeb3df77bdfcf608e520cb82b7443035e4f2a871), [`fc77ddf`](https://github.com/yuzur1ha-org/react/commit/fc77ddffb58cc5de7ae6dc07b0df2fe644e56ad1), [`fc77ddf`](https://github.com/yuzur1ha-org/react/commit/fc77ddffb58cc5de7ae6dc07b0df2fe644e56ad1), [`fc77ddf`](https://github.com/yuzur1ha-org/react/commit/fc77ddffb58cc5de7ae6dc07b0df2fe644e56ad1), [`fc77ddf`](https://github.com/yuzur1ha-org/react/commit/fc77ddffb58cc5de7ae6dc07b0df2fe644e56ad1)]:
  - @yuzur1ha/token@0.2.0
  - @yuzur1ha/ui@0.2.0
  - @yuzur1ha/press@0.2.0
