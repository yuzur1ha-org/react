# Contributing

Use Node 24 or 26 and the pnpm version pinned in package.json.

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm test:unit
pnpm exec playwright install chromium webkit
pnpm test:e2e
pnpm test:production
```

Run `pnpm dev` for Docs. Use built public exports across packages, strict TypeScript and extensionless relative source imports. Do not commit build output, caches or reports.

Run `pnpm changeset` to generate a release record for public changes. Write its summary in English so generated changelogs remain English. Documentation/internal maintenance may use an empty changeset with a reason. Keep the CLI-generated `.changeset/README.md` unchanged. Follow Conventional Commits with English subjects; hooks run lint-staged and commitlint.

Only the root README is bilingual. Package and application READMEs are concise English; third-party notices and Changesets are English. English usage guides live in the Docs application, while its Chinese pages are translation-in-progress notices. Internal review documents under `.soppy/` remain Simplified Chinese. Agent instructions and code comments use English.

Maintainer notes live locally in `.soppy/`. They are optional and are not part of a clean checkout.
