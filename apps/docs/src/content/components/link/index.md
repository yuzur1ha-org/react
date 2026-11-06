---
eyebrow: Component reference
title: Link
description: Links preserve native navigation semantics, including opening another tab and copying the destination.
created: 2026-10-24
updated: 2026-10-24
version: draft
---

## Design notes

Link.Container owns navigation and hover activation; Link.Underline decorates only the selected text. Primary and secondary appearances reuse button styling without press scaling.

## Playground

<!-- prettier-ignore -->
::demo{src="./demo.tsx" export="LinkDemo"}

## API

<!-- prettier-ignore -->
::schema{src="./schema.json"}
