# API 迁移

首版尚未公开发布，不保留旧入口代理。

| 原用法 | OSS 用法 |
| --- | --- |
| `defineYuzur1haPress` / `press/node` | `defineConfig` / `@yuzur1ha/press` |
| `press/reference` | `@yuzur1ha/press-reference` |
| `press/react` 的视觉布局与反馈组件 | `@yuzur1ha/press-theme` |
| `defineYuPressTheme({ Document })` | `defineDocument({ Document })` / `press/react` |
| `theme: "src/docs/site-document.tsx"` | `theme: "@yuzur1ha/press-theme"` + `document: "src/docs/site-document.tsx"` |
| `@yuzur1ha/assets/*` | Docs 本地资源，不是公开包 |

`press/react` 保留 SiteContext、MessagesContext、useSite、useMessages、localeForPath 与共享主题/文档类型。完整主题须提供 ThemeModule 的根布局、文档、首页、加载、错误边界和 404 组件。theme 支持包名或以点开头的本地路径；document 为项目根目录相对路径。

保留 token/CSS/字体入口、UI 明确组件入口、Markdown compiler/plugins/vite/client、Press content/node/vite/site 和 yupress 命令。CLI 的 generate/check/dev/build/preview 语义不变。导入私有源码路径不受支持。

## 本轮代码展示与编译扩展（REQ-013）

| 入口 | 新增契约 | 迁移方式 |
| --- | --- | --- |
| markdown/compiler | elementRenderers、ComponentNode.children | 普通元素可替换成可信 React 组件；undefined 保留原元素，源码位置保留 |
| press config | code: false 或 CodeOptions | 默认 token 高亮/复制；普通块无行号；内置双主题和语言允许列表 |
| press/node | ProjectContext.compileDocument/highlightCode、createCodeService | 自定义内容插件使用项目服务，统一配置和 session 生命周期 |
| press/content | HighlightedCode、CodeToken、CodeOptions | 自有序列化格式，不把 Shiki 类型引入浏览器 |
| press/react | CodeBlock、CodeBlockProvider、CodeBlockViewProps、MarkdownTable | 核心复制与无样式 fallback；主题可选 CodeBlockView 自动接入 |
| ui/code-panel | CodePanel、CodePanelProps | 展示层只消费代码 children、标签、状态和回调 |
| press-reference Demo | 可选 code: HighlightedCode | 通过项目服务预高亮；未提供时显示原文，不在浏览器运行 Prism |

code:false 只关闭代码增强，不关闭表格滚动或自定义元素 renderer。内置主题名称在配置加载时验证；未知文档语言回退原文并提示。复制保留 parser 正文或 Demo 原文件，不附加换行、行号或格式化。旧自定义编译器若直接调用 Markdown 仍然可用，但自行持有渲染策略，不自动继承 Press 配置。

Reference 源码面板随文档一起渲染，不再为浏览器 Prism 创建独立 lazy chunk 或加载占位。异步文档页面仍由默认主题提供加载反馈。
