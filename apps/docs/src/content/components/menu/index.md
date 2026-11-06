---
eyebrow: Component reference
title: Menu
description: Menu uses native navigation links and action buttons rather than emulating an application menu.
created: 2026-10-24
updated: 2026-10-24
version: draft
---

## Design notes

Active appearance can be subtle or solid. ResponsiveMenu reuses the same content across inline, Popover and Drawer layouts and closes after selection by default.

MenuDisclosure and MenuPopover have separate props contracts. contentClassName belongs to the disclosure; triggerAppearance and onCloseAutoFocus belong to the popover. MenuItem closes on ordinary link activation even when app routing prevents default. MenuAction stays open when its click handler prevents default.

## Playground

<!-- prettier-ignore -->
::demo{src="./demo.tsx" export="MenuDemo"}

## API

<!-- prettier-ignore -->
::schema{src="./schema.json"}
