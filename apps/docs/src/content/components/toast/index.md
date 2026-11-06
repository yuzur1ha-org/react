---
eyebrow: Component reference
title: Toast
description: Use one ToastProvider and a shared viewport for independent messages. Simple and rich messages may coexist.
created: 2026-10-24
updated: 2026-10-24
version: draft
---

## Design notes

Each item controls its own lifetime. duration=false keeps a message until it is dismissed; closing state updates before onExitComplete removes the record.

<!-- prettier-ignore -->
::figma{url="https://www.figma.com/design/IsRDCNqIZ1gy7t2aV8YHza?node-id=66-159" title="Toast design" description="Inspect the original component, variants and visual details."}

## Playground

<!-- prettier-ignore -->
::demo{src="./demo.tsx" export="ToastDemo"}

## API

<!-- prettier-ignore -->
::schema{src="./schema.json"}
