<div align="center">

<img src="assets/wordmark.png" alt="Yuzur1ha OSS" width="560" />

[English](README.md) | [简体中文](README.zh-cn.md)

</div>

面向界面与文档的前端工具集：设计 token、可访问的 React 组件、独立 Markdown 编译器与 YuPress 静态文档站。

**当前状态：**六个运行时 ESM 包与一个共享构建工具包，通过 Changesets 发布 PR 独立管理版本。GitHub Pages 部署尚未完成。

## 能力

- 在 CSS 与 React 中共享浅深色 token，按需接入字体和局部 Markdown 排版。
- 使用支持 ref、键盘交互、Portal 和局部主题的可访问组件。
- 在构建时编译 Markdown，支持元数据、source map、可信插件与 Vite 转换。
- 构建具有导航校验、多语言、自动 Shiki 高亮和代码复制的静态文档站。
- 独立使用内容服务，或组合默认主题与 Demo/API 参考文档。

## 选择包

| 包 | 适用场景 | 依赖关系 |
| --- | --- | --- |
| [`@yuzur1ha/token`](packages/token/README.md) | 设计 token、CSS、字体与排版。 | 不依赖 React。 |
| [`@yuzur1ha/ui`](packages/ui/README.md) | 可访问 React 组件。 | 依赖 token；React/DOM/Emotion 为 peer。 |
| [`@yuzur1ha/markdown`](packages/markdown/README.md) | 单文档编译与 Vite 转换。 | 不依赖 Press/UI；React/Vite 集成可选。 |
| [`@yuzur1ha/press`](packages/press/README.md) | 内容服务、CLI、SSG 与无样式 React 运行时。 | 依赖 markdown；不依赖 UI/默认主题。 |
| [`@yuzur1ha/press-theme`](packages/press-theme/README.md) | 默认 YuPress 布局与导航。 | 依赖 press、ui、token。 |
| [`@yuzur1ha/press-reference`](packages/press-reference/README.md) | Demo、源码预览与 schema/API 表格。 | 依赖 press、ui、token；不依赖默认主题。 |
| [`@yuzur1ha/shared`](packages/shared/README.md) | 共享 Vite、声明生成与严格 TypeScript 配置。 | 开发工具；Vite peer。 |

任意前端可选择 token；React 应用可选择 UI；已有发布链路可使用 Markdown；完整内容项目可使用 Press。主题与 reference 是可选适配层。

## 安装与使用

支持 Node 24 或 26。所有包均为 ESM，不提供 CommonJS。按所选包的需要安装 React 19、React DOM 19、Emotion 11、Vite 8 和 React Router 8；精确 peer 范围以各包 manifest 为准。

### Token

```sh
pnpm add @yuzur1ha/token
```

```ts
import { tokens, toCSSVariables } from "@yuzur1ha/token"
import "@yuzur1ha/token/css"

const variables = toCSSVariables(tokens)
```

CSS 入口安装浅深色变量；JavaScript 对象不会加载全局样式。字体、Markdown CSS 与 HeroUI 适配均为可选入口。

### React UI

```sh
pnpm add @yuzur1ha/ui @yuzur1ha/token react react-dom @emotion/react
```

```tsx
import { UIProvider, Button } from "@yuzur1ha/ui"
import "@yuzur1ha/token/fonts.css"

export function Example() {
  return (
    <UIProvider>
      <Button onClick={() => console.log("Saved")}>Save</Button>
    </UIProvider>
  )
}
```

自行使用 `css` prop 时配置 Emotion 自动 JSX runtime（`jsxImportSource: "@emotion/react"`）。UI 提供局部组件样式，Provider 可设置局部 token 覆盖；文案、状态与应用翻译由使用者持有。

### Markdown

```sh
pnpm add @yuzur1ha/markdown
```

```ts
import { compileDocument } from "@yuzur1ha/markdown/compiler"
import { staticHtml } from "@yuzur1ha/markdown/plugins"

const document = await compileDocument("# Hello", "hello.md", {
  analyze: () => ({ category: "guide" }),
  html: staticHtml,
})
console.log(document.code, document.metadata)
```

仅编译时不需要 React 运行时；渲染产物时需要 React。Markdown 源码不是可执行 MDX。HTML 策略适用于可信文档边界，不是任意不可信输入的完整 sanitizer。

### YuPress

```sh
pnpm add @yuzur1ha/press @yuzur1ha/press-theme react react-dom react-router vite @emotion/react
```

```ts
// yupress.config.ts
import { defineConfig } from "@yuzur1ha/press"

export default defineConfig({
  theme: "@yuzur1ha/press-theme",
  content: { srcDir: "content" },
  code: { theme: "tokens", copy: true, lineNumbers: false },
  site: {
    title: "My manual",
    locales: [
      { id: "en", lang: "en", label: "English", sourceDir: "", prefix: "" },
    ],
    sections: [{ id: "manual", label: "Manual", documents: ["index"] }],
  },
})
```

创建包含 `# Hello` 的 `content/index.md`，然后运行：

```sh
pnpm exec yupress dev
pnpm exec yupress build
pnpm exec yupress preview
```

标准代码围栏在构建时高亮，浏览器不加载 Shiki 引擎。默认主题安装 token 与全局样式，字体仍为可选；需要时在本地 document 模块中导入一次字体入口。项目路径托管需设置 `site.base`，并在部署前使用相同 base 验证。

## 文档

- [Markdown 指南](apps/docs/src/content/markdown/index.md)：编译器、插件、Vite 与排版。
- [YuPress 指南](apps/docs/src/content/press/index.md)：配置、内容项目、主题、代码块与部署。
- [贡献指南](CONTRIBUTING.md)：开发与发布要求。

在本地 Docs 站点中可使用指南的路由链接。公开指南与子包 README 使用英文，站点中文翻译正在进行中；内部 `.soppy/` 审阅文档使用简体中文。

## 开发

```sh
pnpm install --frozen-lockfile
pnpm dev
```

使用 pnpm 11.18.0。Docs 地址为 http://127.0.0.1:5173。

| 命令                   | 用途                                        |
| ---------------------- | ------------------------------------------- |
| `pnpm check`           | 构建前置产物，检查 lint、类型、契约与格式。 |
| `pnpm build`           | 构建七包与 Docs 静态站点。                  |
| `pnpm test:unit`       | 包、应用与脚本单元测试。                    |
| `pnpm test:e2e`        | 开发站点浏览器与内容生命周期检查。          |
| `pnpm test:production` | 构建并验证生产 SSG 与补水。                 |

包行为变更请运行 `pnpm changeset`，选择受影响的包并编写英文摘要。独立版本和内部依赖升级由 Changesets 管理，保留其生成的 README；版本号与 CHANGELOG 由 GitHub Actions 通过发布 PR 更新，不在本地生成；npm 发布有独立门禁。

## 限制与状态

这是一个前端工具集，不包含后端服务或托管运行时要求。默认编译器启用 pipe table，并非所有 GFM 扩展。npm 发布、外部 CI、Windows 检查与线上 Pages 托管须区别于本地检查独立验证，现有证据见验收记录。

## 许可

[MIT](LICENSE)。第三方依赖与资源保留各自许可，详见[第三方声明](THIRD_PARTY_NOTICES.md)。
