# ADR-0001：OSS 包与构建边界

状态：Accepted。依据：2026-11-04 用户确认六包、MIT、ESM、独立版本与 Node 24/26，并授权实施；验收结果另记。

依赖方向：token ← ui；markdown ← press；press/ui/token ← press-theme 与 press-reference。主题与 reference 之间无依赖。跨包只能引用明确公开入口。

Press 的 content 是纯内容模型；node/vite/site 是构建工具；react 是无样式上下文与契约。React peers 对纯内容/Node 消费可选，SSG 使用者安装 React/Router/Vite。核心不依赖 UI、Emotion 或默认主题。theme 指定完整主题模块，document 指定可选本地文档渲染器。无 theme 的内容生成允许；站点构建明确报错。

所有包用 Vite library mode 构建 ESM，dependencies/peers（含子路径）external。TS 源码使用 Bundler 模块解析和无后缀相对导入；声明经 tsc 与 AST 规范化输出，实际发布声明兼容 NodeNext。CSS 与 JSX 宿主依赖保留独立入口，不把样式或字体变成不可关闭的全局副作用。

Node 24/26 是支持目标。依赖沿用源主版本，精确版本与新增 Changesets 版本以 pnpm-lock.yaml 为事实源，不能将源项目历史通过情况当作目标验证。
