---
eyebrow: Component reference
title: Select
description: Select uses Radix to provide a labelled choice list with keyboard interaction and focus restoration.
created: 2026-10-24
updated: 2026-10-24
version: draft
---

## Design notes

Pointer highlighting and keyboard focus are separate states. Text appearance stays borderless when open, and options do not scale on press.

Select owns its trigger label, value and icon. It does not support asChild or custom trigger children. Use onValueChange for selection; native trigger onChange is not a selection callback.

<!-- prettier-ignore -->
::figma{url="https://www.figma.com/design/IsRDCNqIZ1gy7t2aV8YHza?node-id=38-714" title="Select design" description="Inspect the original component, variants and visual details."}

## Playground

<!-- prettier-ignore -->
::demo{src="./demo.tsx" export="SelectDemo"}

## API

<!-- prettier-ignore -->
::schema{src="./schema.json"}
