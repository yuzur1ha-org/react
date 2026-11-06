# Engineering rules

Use the pinned pnpm version and one root lockfile. Frozen install is required in CI. Keep strict TypeScript and nearest-project type-aware ESLint. Prettier owns formatting; eslint-config-prettier stays last. Keep source, build-only services and browser runtime boundaries explicit. Do not introduce abstractions or dependencies without a concrete use case. Preserve user edits and report actual commands/results.
