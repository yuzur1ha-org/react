---
"@yuzur1ha/token": minor
"@yuzur1ha/ui": minor
"@yuzur1ha/markdown": minor
"@yuzur1ha/press": minor
"@yuzur1ha/press-theme": minor
"@yuzur1ha/press-reference": minor
---

Add build-time Shiki highlighting, standard Markdown element renderers and shared accessible code panels with clipboard feedback. Expose code configuration and project compilation services; migrate Demo previews from Prism to precompiled tokens.

Unify GFM/API table styling and responsive viewport tiers, stabilize Press navigation typography, and split the Markdown/YuPress guides. Custom content compilers should use ProjectContext.compileDocument and precompile Demo source through highlightCode. Themes may optionally export CodeBlockView; core retains an unstyled fallback.

Keep the brand inset at 32px across tablet and desktop layouts, independently of the responsive header-control inset.

Reserve a fixed 180px brand link content width across viewport tiers, prevent flex shrinking during resize, and truncate long site titles within the reserved space.
