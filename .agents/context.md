# Current context

The user authorized implementation of the OSS migration on 2026-11-04. The source is a read-only reference; a hash/status baseline is recorded under .soppy/features/oss-migration. The target has six independently versioned ESM packages: token, ui, markdown, press, press-theme and press-reference, initially 0.1.0. Docs owns local brand assets.

MIT is selected. Node 24 and 26 are the support targets. Vite builds JavaScript; strict TypeScript produces declarations with build-only module normalization. Source relative imports are extensionless. Press core has no UI, Emotion or default-theme dependency. Theme and document renderer configuration are separate.

Local implementation is authorized; no commit, push, npm publication or Pages deployment has been performed. Read the acceptance record for actual verification and remaining external setup. Do not inherit historical source-project acceptance claims.

## Local delivery

The six packages, Docs, agent rules, a bilingual root README, English package notes, license records and gated workflows are implemented. Node 24/26 artifact consumers pass with strict public declarations; Docs browser/SSG/base checks pass locally. Exact commands, counts, development-tool type limitations and external blockers are recorded once in .soppy/features/oss-migration/acceptance.md. Do not claim GitHub CI, Windows, npm or Pages publication has been verified. No commits or pushes are authorized by these records.

## Documentation policy update

The user superseded the earlier package bilingual policy: only the root README is bilingual. Package/application READMEs and third-party notices are concise English; package-local Chinese guides are removed. English Markdown/Press guides are expanded on the Docs site. Chinese site pages are short translation-in-progress notices. Internal .soppy/ review records stay Chinese. Changesets use the CLI-generated README and English summaries; root CLI/GitHub-changelog dependencies and independent versions remain unchanged.

## Press code and documentation updates

The approved refinement adds multi-page English Markdown/Press guides, shared token table styling, consistent viewport tiers and stable Press navigation text. Press owns Node-only Shiki sessions and configuration; ProjectContext.compileDocument/highlightCode are the shared extension path. Markdown elementRenderers stays generic. Core React owns copying and an unstyled fallback; UI CodePanel is presentation-only; optional theme CodeBlockView and independent reference adapters share it. Demo source is precompiled with its document, without Prism or a separate loading chunk. See .soppy/plans/press-polish.md and .soppy/features/press-polish/acceptance.md for actual local evidence; no external CI/publication claim is implied.

## Live resize follow-up

The user still reports spacing/weight flicker while dragging Chrome on /ui/foundations/. Do not claim that this is resolved by settled-frame checks. Brand inset is now 32px for tablet/desktop and 20px for phone. Follow .soppy/features/press-polish/resize-follow-up.md; the user confirms Chrome page zoom is already 100%, while native presentation remains unverified. Do not ask them to confirm 100% again.

## Shared tooling package

The user authorized adding @yuzur1ha/shared as the seventh package for reusable build configuration. It exposes ./vite, ./declarations and ./tsconfig/base.json, is used only as a development dependency by runtime packages, and bootstraps with tsc to avoid a self-hosting build cycle. UI public entries stay local to UI vite.config.ts. Historical six-package verification counts above do not include this package; consult the engineering implementation record for new evidence.

Declaration generation now runs through the shared yu-build-declarations CLI, with ambient shims explicitly configured by Markdown. Scripts/verify-source and the unused Press dist-only wrapper are retired; historical baseline records remain. Docs owns the Pages test under apps/docs/tests/pages.e2e.mjs, using isolated output rather than replacing Docs dist.

## Test and tooling layout

The user requested deleting the root tests/ directory. Repository policy tests, tarball consumer fixtures and their command/CI gates are removed rather than relocated. Vitest runs package/application tests; Playwright runs browser tests. Root scripts retains only Changeset maintenance and license inventory. Do not recreate the deleted suites without explicit authorization. Historical acceptance results describe their earlier snapshots and do not imply these gates still exist.

## Repository and release workflow update

The user authorized local commits and migration of origin to https://github.com/yuzur1ha-org/react.git. Commit fc77ddf contains the workspace consolidation. No push or publication has been performed. Local version preparation was reverted; all seven packages remain at 0.1.0 with pending Changesets. Version and CHANGELOG changes belong to the GitHub release PR. Repository metadata and Pages base target the new repository; external App permissions, npm trust, CI and Pages hosting remain unverified.
