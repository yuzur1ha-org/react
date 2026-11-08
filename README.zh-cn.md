<div align="center">

<img src="assets/wordmark.png" alt="Yuzur1ha OSS" width="560" />

[![YuPress on npm](https://img.shields.io/npm/v/%40yuzur1ha%2Fpress?label=YuPress)](https://www.npmjs.com/package/@yuzur1ha/press) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6)

[English](README.md) | [简体中文](README.zh-cn.md)

</div>

Yuzur1ha 提供 React 界面组件和 YuPress 静态文档工具。可以只引入设计变量或某个组件，也可以用 YuPress 把 Markdown 指南和组件示例构建成文档站。

## 快速开始

使用 Node.js 24 或 26。在 React 应用中安装 UI 组件及其运行时依赖。

```sh
pnpm add @yuzur1ha/ui @yuzur1ha/token react react-dom @emotion/react
```

```tsx
import { Button, UIProvider } from "@yuzur1ha/ui"

export function Example() {
  return (
    <UIProvider>
      <Button>Continue</Button>
    </UIProvider>
  )
}
```

## 包列表

| 包 | 适用场景 | 依赖关系 |
| --- | --- | --- |
| [`@yuzur1ha/token`](packages/token/README.md) | 设计 token、CSS、字体与排版。 | 不依赖 React。 |
| [`@yuzur1ha/ui`](packages/ui/README.md) | 可访问 React 组件。 | 依赖 token；React/DOM/Emotion 为 peer。 |
| [`@yuzur1ha/markdown`](packages/markdown/README.md) | 单文档编译与 Vite 转换。 | 不依赖 Press/UI；React/Vite 集成可选。 |
| [`@yuzur1ha/press`](packages/press/README.md) | 内容服务、CLI、SSG 与无样式 React 运行时。 | 依赖 markdown；不依赖 UI/默认主题。 |
| [`@yuzur1ha/press-theme`](packages/press-theme/README.md) | 默认 YuPress 布局与导航。 | 依赖 press、ui、token。 |
| [`@yuzur1ha/press-reference`](packages/press-reference/README.md) | Demo、源码预览与 schema/API 表格。 | 依赖 press、ui、token；不依赖默认主题。 |
| [`@yuzur1ha/shared`](packages/shared/README.md) | 共享 Vite、声明生成与严格 TypeScript 配置。 | 开发工具；Vite peer。 |

## 文档

- [创建 YuPress 站点](apps/docs/src/content/press/getting-started.md)
- [在已有项目中编译 Markdown](apps/docs/src/content/markdown/getting-started.md)
- [开发与贡献](CONTRIBUTING.md)
- [各包发布记录](https://github.com/yuzur1ha-org/react/releases)

## 许可

[MIT](LICENSE)。第三方依赖与资源保留各自许可，详见[第三方声明](THIRD_PARTY_NOTICES.md)。
