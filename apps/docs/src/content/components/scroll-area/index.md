---
eyebrow: Component reference
title: Scroll area
description: ScrollArea keeps native scrolling while adding narrow, square custom tracks. Choose normal, contrast or hidden to fit the surrounding surface.
created: 2026-10-24
updated: 2026-10-24
version: draft
---

## Design notes

Two-axis scrolling preserves browser keyboard behavior and Shift plus wheel for horizontal movement. Keep one scroll owner per region and respect reduced motion.

Use appearance="hidden" when rails would distract from a compact control group. Scrolling, touch and keyboard access remain available; provide a clear content cue for overflow.

Use root onWheelCapture when cancelling built-in wheel compensation over both the viewport and rails. viewportProps.onWheelCapture covers viewport content only.

## Playground

<!-- prettier-ignore -->
::demo{src="./demo.tsx" export="ScrollAreaDemo"}

## API

<!-- prettier-ignore -->
::schema{src="./schema.json"}

Scroll chaining defaults to the browser’s auto behavior: continuing at an edge can move an ancestor. Use overscrollBehavior="contain" for independent navigation surfaces. Containment applies to enabled axes only. Ordinary wheel gestures keep their native axes; Shift plus wheel moves the nearest available horizontal viewport, then its ancestor at the boundary. Sibling regions stay independent. Wheel gestures over a track use the viewport too; the tracks become interactive again after the gesture or pointer movement.
