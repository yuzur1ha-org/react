# @yuzur1ha/press

## 0.2.1

### Patch Changes

- [#3](https://github.com/yuzur1ha-org/react/pull/3) [`eed4cef`](https://github.com/yuzur1ha-org/react/commit/eed4cef106908a935e0236df94f8e3924e078dfd) Thanks [@soppylzz](https://github.com/soppylzz)! - Reuse the loaded site configuration within each generation and cache validated compiled documents across transforms. Publish complete snapshot revisions during development and track nested external content directories.

  Suppress dependent hot updates before framework hooks run and discard superseded development revisions before reloading the browser.

- [#3](https://github.com/yuzur1ha-org/react/pull/3) [`eed4cef`](https://github.com/yuzur1ha-org/react/commit/eed4cef106908a935e0236df94f8e3924e078dfd) Thanks [@soppylzz](https://github.com/soppylzz)! - Preserve unrelated files during content generation, detect restored documents and tracked input changes, confine static preview reads to the output directory, validate the destination and ownership marker before replacing a static build, and emit a root 404.html for static hosting.
- Updated dependencies [[`eed4cef`](https://github.com/yuzur1ha-org/react/commit/eed4cef106908a935e0236df94f8e3924e078dfd)]:
  - @yuzur1ha/markdown@0.2.1

## 0.2.0

### Minor Changes

- [#1](https://github.com/yuzur1ha-org/react/pull/1): Add shared project compilation services, build-time Shiki highlighting and configurable code blocks with an optional theme renderer. Refresh generated router modules after content changes and recover when tracked content directories are deleted.

### Dependencies

- Update `@yuzur1ha/markdown` to `0.2.0`.
