---
eyebrow: Component reference
title: Number field
description: NumberField uses a text spinbutton with custom increment and decrement actions. Decimal stepping avoids binary floating-point drift.
created: 2026-10-24
updated: 2026-10-24
version: draft
---

## Design notes

Only the step icons scale on press. Focus and error borders live above the button backgrounds, and keyboard input remains available.

<!-- prettier-ignore -->
::figma{url="https://www.figma.com/design/IsRDCNqIZ1gy7t2aV8YHza?node-id=38-668" title="Number field design" description="Inspect the original component, variants and visual details."}

## Playground

<!-- prettier-ignore -->
::demo{src="./demo.tsx" export="NumberDemo"}

## API

<!-- prettier-ignore -->
::schema{src="./schema.json"}
