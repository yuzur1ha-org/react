---
eyebrow: Component reference
title: Modal
description: Modal interrupts the current task for a focused decision or edit. Give every dialog a clear title and a reachable close action.
created: 2026-10-24
updated: 2026-10-24
version: draft
---

## Design notes

Focus stays inside the dialog while open and returns to the trigger when closed. Keep a recoverable draft until the user confirms the change.

<!-- prettier-ignore -->
::figma{url="https://www.figma.com/design/IsRDCNqIZ1gy7t2aV8YHza?node-id=66-160" title="Modal design" description="Inspect the original component, variants and visual details."}

## Playground

<!-- prettier-ignore -->
::demo{src="./demo.tsx" export="ModalDemo"}

## API

<!-- prettier-ignore -->
::schema{src="./schema.json"}
