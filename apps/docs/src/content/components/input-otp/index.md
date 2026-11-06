---
eyebrow: Component reference
title: Input OTP
description: InputOTP displays one logical input as six visual slots. The slots do not create six separate focus stops.
created: 2026-10-24
updated: 2026-10-24
version: draft
---

## Design notes

Pasting and keyboard editing belong to the input; read-only state must also prevent paste mutations. Six slots describe this component, not a production authentication policy.

<!-- prettier-ignore -->
::figma{url="https://www.figma.com/design/IsRDCNqIZ1gy7t2aV8YHza?node-id=66-157" title="Input OTP design" description="Inspect the original component, variants and visual details."}

## Playground

<!-- prettier-ignore -->
::demo{src="./demo.tsx" export="OTPDemo"}

## API

<!-- prettier-ignore -->
::schema{src="./schema.json"}
