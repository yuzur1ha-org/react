# Repository agent instructions

Read `.agents/context.md` and `.agents/rules/{workflow,engineering,frontend,packages,testing,release,commits,comments,docs}.md` explicitly before work. Read the applicable `.agents/roles/` brief and nested AGENTS.md.

This repository contains six open-source frontend packages and their Docs application. Backend services, product applications, authentication, billing and database work are out of scope.

Follow requirements/use cases → public API and package boundaries → necessary UI design → implementation → isolated artifact acceptance → release. Agent instructions use English. Only the root README is bilingual. Package/application READMEs, third-party notices, Changesets and public usage guides use English. Review documents under docs/ remain Simplified Chinese; Chinese site pages contain brief translation-in-progress notices. Code identifiers and comments use English.

Preserve user changes. Do not mutate the source/reference repository. Never import secrets, local state, node_modules, caches or build output. Use public built exports across package boundaries. Relative TypeScript source imports omit JavaScript extensions. Generated JavaScript and published declarations must resolve in their target environments.

Distinguish proposals, implementation, local verification, CI verification and publication. Never invent passing checks, package availability, Figma links or deployment evidence. See `docs/plans/oss-migration.md` and `docs/features/oss-migration/acceptance.md`.

Role briefs do not create agents. Do not delegate without explicit authorization. Commits, pushes, external account changes and publication require authorization in the current task. Local reversible implementation/checks do not need repeated approval.
