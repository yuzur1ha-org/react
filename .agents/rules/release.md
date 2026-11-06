# Release rules

Use independent Changesets versions and workspace:^ dependency propagation. Public behavior changes need a changeset; documentation/internal changes may use an empty changeset with a reason. Build and validate the exact commit before publication/deployment. First publication bootstraps package ownership; subsequent publication uses per-package npm OIDC trust. Never print credentials, overwrite versions or automatically unpublish. Re-run partial releases safely. See docs/operations/runbooks/release.md.

Generate changesets through `pnpm changeset` and write summaries in English so generated CHANGELOG files remain English. Keep the CLI-generated README unchanged. Root @changesets/cli and @changesets/changelog-github are the release tooling sources.
