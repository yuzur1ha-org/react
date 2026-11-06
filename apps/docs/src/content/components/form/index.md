---
eyebrow: Component reference
title: Form
description: Form composes native validation, labels, controls and messages without duplicating field ownership.
created: 2026-10-24
updated: 2026-10-24
version: draft
---

## Design notes

Combine FormLabel and FormControl asChild with Input or TextareaInput. Non-native controls such as Select need their own validation and focus handling.

## Playground

<!-- prettier-ignore -->
::demo{src="./demo.tsx" export="FormDemo"}

## API

<!-- prettier-ignore -->
::schema{src="./schema.json"}
