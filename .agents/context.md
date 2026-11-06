# Current context

The user authorized implementation of the OSS migration on 2026-11-04. The source is a read-only reference; a hash/status baseline is recorded under docs/features/oss-migration. The target has six independently versioned ESM packages: token, ui, markdown, press, press-theme and press-reference, initially 0.1.0. Docs owns local brand assets.

MIT is selected. Node 24 and 26 are the support targets. Vite builds JavaScript; strict TypeScript produces declarations with build-only module normalization. Source relative imports are extensionless. Press core has no UI, Emotion or default-theme dependency. Theme and document renderer configuration are separate.

Local implementation is authorized; no commit, push, npm publication or Pages deployment has been performed. Read the acceptance record for actual verification and remaining external setup. Do not inherit historical source-project acceptance claims.

## Local delivery

The six packages, Docs, agent rules, a bilingual root README, English package notes, license records and gated workflows are implemented. Node 24/26 artifact consumers pass with strict public declarations; Docs browser/SSG/base checks pass locally. Exact commands, counts, development-tool type limitations and external blockers are recorded once in docs/features/oss-migration/acceptance.md. Do not claim GitHub CI, Windows, npm or Pages publication has been verified. No commits or pushes are authorized by these records.

## Documentation policy update

The user superseded the earlier package bilingual policy: only the root README is bilingual. Package/application READMEs and third-party notices are concise English; package-local Chinese guides are removed. English Markdown/Press guides are expanded on the Docs site. Chinese site pages are short translation-in-progress notices. Internal docs/ review records stay Chinese. Changesets use the CLI-generated README and English summaries; root CLI/GitHub-changelog dependencies and independent versions remain unchanged.

## Press code and documentation updates

The approved refinement adds multi-page English Markdown/Press guides, shared token table styling, consistent viewport tiers and stable Press navigation text. Press owns Node-only Shiki sessions and configuration; ProjectContext.compileDocument/highlightCode are the shared extension path. Markdown elementRenderers stays generic. Core React owns copying and an unstyled fallback; UI CodePanel is presentation-only; optional theme CodeBlockView and independent reference adapters share it. Demo source is precompiled with its document, without Prism or a separate loading chunk. See docs/plans/press-polish.md and docs/features/press-polish/acceptance.md for actual local evidence; no external CI/publication claim is implied.

## Live resize follow-up

The user still reports spacing/weight flicker while dragging Chrome on /ui/foundations/. Do not claim that this is resolved by settled-frame checks. Brand inset is now 32px for tablet/desktop and 20px for phone. Follow docs/features/press-polish/resize-follow-up.md; the user confirms Chrome page zoom is already 100%, while native presentation remains unverified. Do not ask them to confirm 100% again.
