---
"@yuzur1ha/press": patch
---

Invalidate generated router modules after content changes so deleted pages render the current not-found route.

Regenerate the content snapshot when a tracked content directory is removed, including platforms that report the directory event without individual file events.
