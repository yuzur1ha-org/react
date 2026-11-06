# Release rules

Use independent Changesets versions and workspace:^ dependency propagation. Public behavior changes need a changeset; documentation/internal changes may use an empty changeset with a reason. Build and validate the exact commit before publication/deployment. First publication bootstraps package ownership; subsequent publication uses per-package npm OIDC trust. Never print credentials, overwrite versions or automatically unpublish. Re-run partial releases safely. See .soppy/operations/runbooks/release.md.

Generate changesets through `pnpm changeset` and write summaries in English so generated CHANGELOG files remain English. Keep the CLI-generated README unchanged. Root @changesets/cli and @changesets/changelog-github are the release tooling sources.

Repository metadata targets `yuzur1ha-org/react`; Pages uses `/react/`. Keep pending Changeset records in source control. Version bumps, dependency propagation and CHANGELOG generation run only in the GitHub release PR job; do not run `pnpm version-packages` locally. The release PR job is independent of `RELEASE_ENABLED`; npm publication still requires that flag, an approved release environment and no pending changesets. GitHub App credentials and npm trust must be configured for the new repository separately.
