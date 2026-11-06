---
eyebrow: Component reference
title: Button
description: A button performs an action. Keep navigation in Link and let labels describe the result of activation.
created: 2026-10-24
updated: 2026-10-24
version: draft
---

## Design notes

Primary actions use ink and paper. Secondary and text appearances share the same sizes; scaleOnPress can disable the press transform while retaining color feedback.

CloseButton is the fixed icon-only close action. Supply its accessible label; it always renders type="button".

<!-- prettier-ignore -->
::figma{url="https://www.figma.com/design/IsRDCNqIZ1gy7t2aV8YHza?node-id=38-725" title="Button design" description="Inspect the original component, variants and visual details."}

## Playground

<!-- prettier-ignore -->
::demo{src="./demo.tsx" export="ButtonDemo"}

## API

<!-- prettier-ignore -->
::schema{src="./schema.json"}
