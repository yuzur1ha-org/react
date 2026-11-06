---
eyebrow: Tooling / Markdown
description: Understand compiler inputs, metadata, output and HTML policy.
---

# Compiler and metadata

- `analyze`: required application metadata reader; it may be asynchronous.
- `remarkPlugins` / `rehypePlugins`: trusted build-time syntax and tree extensions.
- `remarkTables`: opt-in pipe-table syntax; it does not enable every GFM feature.
- `handlers` / `passThrough`: HAST conversion customization using the upstream converter contracts.
- `html`: optional application HTML policy. The provided `staticHtml` rejects specific executable elements, event attributes and unsafe URL schemes; it is not a complete sanitizer for arbitrary untrusted content.
- `elementRenderers`: optional standard-element component renderers; see [extensions](/markdown/plugins/#standard-element-renderers).
- `directives`: named rules for leaf, container or inline directives. Unknown directive handling and application-specific validation remain explicit policies.

The input is Markdown, not executable MDX source. JSX-like expressions and import statements in authored Markdown do not register runtime modules. Trusted compiler plugins introduce component bindings deliberately.

## Metadata and output

`compileDocument` is asynchronous. Its result includes React ESM `code`, a source `map`, application `metadata`, raw `frontmatter`, optional frontmatter source/position, and `dependencies`. The compiler receives source text and a file identity; it does not discover files, read the filesystem, create navigation or write a site.

`analyze(tree, context)` receives the parsed HAST and controls metadata. Use the optional `consumeTitle` helper to remove a leading H1 and return it as a title when a surrounding document renderer owns that heading. Frontmatter is parsed as YAML and remains available through `context.frontmatter`; `readMetadata` can validate selected fields and apply fallbacks. Unknown fields remain in the raw frontmatter rather than automatically becoming public metadata. Invalid supplied values must be handled explicitly.

## Errors and resource ownership

Compiler failures preserve the source identity and position when available. Plugins can call `context.fail(message, position)` for authored errors and register referenced modules through `context.import`. Filesystem access, resource authorization, path resolution, public URLs and output writes remain host responsibilities. Do not execute untrusted compiler plugins or assume that code generation validates application metadata policies.
