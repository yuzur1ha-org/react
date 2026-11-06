# Testing rules

Use pnpm check, test:unit, test:e2e and test:production as appropriate. The root tests/ directory and automated tarball-consumer/repository-policy suites were removed at the user's request. Do not recreate them without explicit authorization. Do not depend on warmed offline caches, source aliases, hardcoded release versions or source-node_modules links. Preserve migrated test assertions; update expectations only for approved contract changes. Missing tests do not pass. Record OS/Node versions and distinguish local results from CI.

Use Vitest for unit and repository policy tests, and Playwright for browser tests. Keep tests with their owning package or application. Do not add standalone verification commands for checks an existing test runner can own. Retain standalone tooling only for substantive artifact consumption, release or maintenance work. Ignored .soppy notes must not be required by clean-checkout checks.

Run Docs development suites in separate Playwright invocations. The content lifecycle suite mutates the shared content tree and generated site cache; do not run it beside other Docs servers targeting the same application directory. CI uses two workers to bound cold compilation and browser contention.

Default PR CI uses targeted browser coverage; full browser and Windows suites are opt-in via ci.yml workflow_dispatch full=true. Version-only PR classification comes from the existing Changeset policy diff, not a branch-name bypass. Version PRs build, typecheck and pack packages. CD relies on merged PR checks and rebuilds release artifacts without repeating full quality. Do not describe targeted CI as a completed full browser run.
