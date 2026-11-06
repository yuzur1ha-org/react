# Testing rules

Use pnpm check, test:unit, test:package, test:e2e and test:production as appropriate. Test installed tarballs outside the workspace under Bundler and NodeNext with skipLibCheck false. Do not depend on warmed offline caches, source aliases, hardcoded release versions or source-node_modules links. Preserve migrated test assertions; update expectations only for approved contract changes. Missing tests do not pass. Record OS/Node versions and distinguish local results from CI.
