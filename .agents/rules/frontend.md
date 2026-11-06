# Frontend rules

Keep accessible semantic controls, keyboard/focus behavior, reduced-motion support, responsive layouts and scoped styles. React, React DOM and Emotion are host peers rather than bundled copies. Shared components receive consumer strings; app catalogs stay app-owned. Avoid browser globals at module load and test SSR imports. External data starts as unknown. Do not render untrusted HTML without the documented compiler/sanitization boundary.
