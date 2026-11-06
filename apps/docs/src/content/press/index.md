---
eyebrow: Tooling / Press
description: A content toolkit and static documentation framework.
---

# YuPress

YuPress compiles a content project, validates navigation and prerenders a static React documentation site. It builds on the standalone [Markdown compiler](/markdown/). The default theme and component-reference tools are separate, optional packages.

## Choose a guide

- [Getting started](/press/getting-started/): create a site and use the CLI.
- [Configuration](/press/configuration/): sources, locales, navigation and rendering options.
- [Content projects and plugins](/press/content/): discovery, lifecycle and shared compilation.
- [Themes](/press/theme/): full themes, document renderers and headless consumers.
- [Code blocks](/press/code-blocks/): automatic Shiki highlighting and copying.
- [Deployment](/press/deployment/): SSG, base paths and static hosting.

## Package boundaries

Core exposes content models, Node services, Vite integration, CLI and unstyled React contracts. It does not depend on UI, Emotion or a default theme. Use `@yuzur1ha/press-theme` for the supplied visual site and `@yuzur1ha/press-reference` for Demo/API documentation. Applications retain their metadata schemas and publication policies.

## Previous guide links

<a id="content-and-node-apis" href="/press/content/">Content and Node APIs →</a> <a id="static-site" href="/press/getting-started/">Static site →</a> <a id="independent-applications" href="/press/theme/">Independent applications →</a> <a id="quick-start" href="/press/getting-started/">Quick start →</a> <a id="configuration" href="/press/configuration/">Configuration →</a> <a id="cli-commands" href="/press/getting-started/#cli-commands">CLI commands →</a> <a id="public-entry-points" href="/press/content/">Public entry points →</a> <a id="content-plugins" href="/press/content/#content-plugins">Content plugins →</a> <a id="themes-and-document-renderers" href="/press/theme/">Themes →</a> <a id="headless-vite-integration" href="/press/content/#headless-vite-integration">Headless Vite →</a> <a id="locales-navigation-and-deployment" href="/press/configuration/#locales-and-navigation">Locales and navigation →</a>
