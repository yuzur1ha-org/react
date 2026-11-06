# Docs

The documentation application for the Yuzur1ha frontend toolkit. It consumes the public Press, default-theme and reference packages.

- `src/content/`: English guides, component references and short Chinese translation notices.
- `scripts/content/`: application-owned metadata, demo and API-schema validation.
- `yupress.config.ts`: navigation, locales, theme and document renderer configuration.
- `src/assets/` and `licenses/`: local branding and original font license texts.

Run `pnpm dev` or `pnpm build` from the repository root. Generated `.cache/press/` and `dist/` directories are disposable. Builds copy font licenses to `dist/licenses/`.

Detailed Markdown and Press usage belongs in the site guides. Chinese translations are in progress. Internal review records remain in the root `.soppy/` directory.

For a cold start, run `pnpm dev` from the repository root. It builds library artifacts before starting Docs. After changing library sources, stop Docs, run `pnpm build:packages`, and restart Docs. The application consumes public built exports; do not run competing watchers that replace the same `dist` directory. `pnpm --filter @yuzur1ha/docs test:e2e --list` lists the root Docs test projects; additional Playwright arguments apply to all three development project groups.

`pnpm test:pages` at the repository root prepares libraries and runs the Docs-owned root/subpath deployment checks. These checks use temporary output under `apps/docs/.cache`, copy public license resources there and leave the normal Docs `dist` output unchanged.
