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

Set `site.base` to `/` for a domain root or `/repository-name/` for a project site such as GitHub Pages. Build and verify the same base you deploy, including assets, locale links, deep-link refreshes and 404 pages. The output is a static site, not a backend service. Consumers remain responsible for hosting, domain settings, asset licenses and release permissions.

## GitHub Pages checklist

For this repository the planned project base is `/react/`. Deploy only a verified main build. Verify static asset URLs, deep-link refreshes, locale navigation and real 404 behavior against the same base. Pages hosting and npm publication are separate workflows; a deployment failure does not justify republishing package versions. The public site is not yet deployed.
