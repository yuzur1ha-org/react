# Contributing

## Run the project locally

Use Node.js 24 or 26 and pnpm 11.18.0. From the repository root, install the locked dependencies and start the Docs site.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://127.0.0.1:5173. Docs consumes the packages through their built exports. If you change a library while the server is running, stop it and rerun `pnpm dev` to rebuild the packages.

## Make a change

Keep runtime code and tests in the package that owns the behavior. Import other packages through their public exports and omit JavaScript extensions on relative TypeScript source imports. Put user-facing examples and English guides in [the Docs content directory](apps/docs/src/content). Keep both root READMEs in sync when changing installation instructions or project descriptions.

Run `pnpm check` for lint, types and formatting, and `pnpm test:unit` for unit tests. For browser changes, install Chromium and WebKit with `pnpm exec playwright install chromium webkit`, then choose the checks that exercise your change.

| Command | Coverage |
| --- | --- |
| `pnpm test:e2e` | Development site interactions and content updates |
| `pnpm test:production` | Static rendering and hydration in the production site |
| `pnpm test:pages` | Navigation, assets and 404s at the root and under `/react/` |

## Open a pull request

Target `main` from a topic branch. Use an English Conventional Commit subject such as `fix(press): preserve locale on navigation`. Describe the user-visible change, how to reproduce it and which checks you ran.

For a public package change, run `pnpm changeset`, select the affected packages and write an English summary for their changelogs. Documentation and internal changes may use `pnpm changeset --empty` with a reason. The release workflow prepares versions and changelogs in a separate PR.

Code PRs run checks on Node 24 and 26 plus targeted browser tests. Maintainers can run the full browser and Windows suites with the `full` input on the CI workflow. The [CD workflow](.github/workflows/cd.yml) handles package releases and GitHub Pages deployment from `main`.
