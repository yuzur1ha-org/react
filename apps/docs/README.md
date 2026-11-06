# Docs

The documentation application for the Yuzur1ha frontend toolkit. It consumes the public Press, default-theme and reference packages.

- `src/content/`: English guides, component references and short Chinese translation notices.
- `scripts/content/`: application-owned metadata, demo and API-schema validation.
- `yupress.config.ts`: navigation, locales, theme and document renderer configuration.
- `src/assets/` and `licenses/`: local branding and original font license texts.

Run `pnpm dev` or `pnpm build:docs` from the repository root. Generated `.cache/press/` and `dist/` directories are disposable. Builds copy font licenses to `dist/licenses/`.

Detailed Markdown and Press usage belongs in the site guides. Chinese translations are in progress. Internal review records remain in the root `docs/` directory.
