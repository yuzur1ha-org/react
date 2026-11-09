---
eyebrow: Tooling / Press
description: Deploy prerendered output at a domain root or project base.
---

# Static builds and deployment

## Build and preview

```sh
pnpm exec yupress build
pnpm exec yupress preview --port 5173
```

The build prerenders document bodies, syntax tokens, home pages and a 404 before replacing the owned static output. Preview serves that directory without requiring source files or the original configuration. A failed prerender does not publish a partial site.

## Deployment base

Set `site.base` to `/` for a domain root or `/repository-name/` for a project site such as GitHub Pages. Build and verify the same base you deploy, including assets, locale links, deep-link refreshes and 404 pages. The build also places the prerendered error page at `404.html` for static hosts such as GitHub Pages. Consumers remain responsible for hosting, domain settings, asset licenses and release permissions.

## GitHub Pages checklist

This repository deploys Docs from main through the `cd.yml` GitHub Actions workflow, independently of npm publication. Its build reads the Pages `base_path` from `actions/configure-pages` and passes it as `YUPRESS_BASE`: `/react/` for `https://yuzur1ha-org.github.io/react/`, or `/` when a custom domain is configured. Rebuild after changing the Pages domain setting.

For `oss.yuzur1ha.top`, configure a DNS CNAME pointing to `yuzur1ha-org.github.io` and save the custom domain in the repository's Pages settings. GitHub redirects the default project URL to the custom domain. A `CNAME` file is not required for Actions deployments. Verify static assets, deep-link refreshes, locale navigation and real 404 responses after deployment; a deployment failure does not justify republishing package versions.
