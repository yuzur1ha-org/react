---
eyebrow: Component reference
title: Meter
description: Meter communicates a bounded numeric measurement with a label and an accessible value.
created: 2026-10-24
updated: 2026-10-24
version: draft
---

## Design notes

Keep the range meaningful and show enough context to interpret the number. The component normalizes invalid or out-of-range values for rendering.

## Playground

<!-- prettier-ignore -->
::demo{src="./demo.tsx" export="MeterDemo"}

## API

<!-- prettier-ignore -->
::schema{src="./schema.json"}
