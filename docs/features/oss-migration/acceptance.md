# OSS 迁移验收

日期：2026-11-04。状态：P0–P4 已实现并完成本地验收；P5 外部发布待配置和授权。CI 尚未在 GitHub 运行，不记为 CI 已验证或已发布。

## 基线与环境

- 源 HEAD：`64f5f3676fd681be59d497d7dc452957e30270d8`。原有工作区改动保留；[源基线](source-baseline.json)记录 893 个文件的 SHA-256、HEAD 和 Git 状态。
- 目标为独立 Git 仓库，main 尚无初始提交；仅配置本地 origin，没有 commit/push。用本次文件状态和以下命令结果标识交付，不编造目标提交 SHA。
- 本地：macOS 27.0.1（26A434）、arm64；Node 24.22.2 / 26.5.1；pnpm 11.18.0 的 JS 分发；Playwright 1.64.1 / Chromium。
- 新工具版本经 npm registry 核实；共享开发版本集中于 catalog。Actions tag/提交来源见 [固定版本](../../architecture/action-pins.md)。

## 需求验收

| 需求 | 实现与证据 | 结果 |
| --- | --- | --- |
| REQ-001 | `node scripts/verify-source.mjs <source>` 比较全部 893 个文件、HEAD、工作区状态及空暂存 diff；目标不含源绝对路径依赖 | 本地通过 |
| REQ-002 | frozen install、`pnpm check`；Husky `core.hooksPath=.husky/_`；commitlint/lint-staged；Actions YAML 解析、SHA 核实；版本规则和 Changesets 真实版本传播测试 | 本地通过；远端 CI 待运行 |
| REQ-003 | 六包 Vite ESM、显式 exports、AST 声明规范化；无依赖循环、核心无视觉依赖、源码导入边界检查 | 本地通过 |
| REQ-004 | Docs 三栏目、英文指南与中文翻译占位、本地品牌资源；321 项开发浏览器测试、生产 SSG/补水及部署 base 验收 | 本地通过 |
| REQ-005 | 根双语 README、子包英文说明、OSS Agent、MIT、直接依赖许可清单、静态字体 OFL；文档链接检查 | 本地通过 |
| REQ-006 | 六包工作区外 tarball、全部运行时公开入口、CSS、NodeNext/Bundler 严格类型、自定义主题、CLI 与无源文件预览 | Node 24/26 本地通过 |
| REQ-007 | npm、OIDC、GitHub CI、Pages 和 registry 安装回归 | 未发布/未验证 |

完整 ID 前缀均为 `oss-migration:`；任务对应关系见 [需求记录](README.md)。后端接口/数据库 N/A；本轮沿用现有视觉实现，没有新建 Figma 设计或声称重新核验全部节点。

## 迁移阶段实际执行

| 命令 / 场景 | 结果 |
| --- | --- |
| `pnpm install --frozen-lockfile` | Node 24/26 通过；没有复制源锁文件或 node_modules |
| `pnpm check` | 六包构建、33 篇内容生成、ESLint、全工作区类型、源码边界/依赖图/本地链接、Prettier 通过 |
| `pnpm test:unit` / `pnpm exec vitest run` | 两个 Node 版本均为 64 文件 / 237 测试通过 |
| `node --test scripts/tests/*.test.mjs` | 两个 Node 版本均 5 测试通过：声明引用/失败分支、Changeset 门禁、独立版本传播及重复版本命令行为 |
| `pnpm test:package` / `node scripts/verify-packages.mjs` | 两个 Node 版本通过；六 tarball，不依赖离线预热缓存；NodeNext 和 Bundler 均不使用 skipLibCheck |
| Markdown `/client` 类型入口 | Node 24/26 的独立 tarball 消费者均通过 NodeNext/Bundler；`*.md` 默认导出和自定义段落 props 严格推导 |
| `playwright test --project=docs:*` | 最终完整运行 321 通过、1 跳过；跳过保留原设计：移动端没有鼠标，不能验证 pointer hover |
| Tooltip 重复场景 | 显式滚动完成后聚焦，连续 10 次通过；保留文本与 Escape 关闭断言 |
| `playwright test --project=docs-content:*` | 1 通过；编译错误恢复、缺失引用、文件删除与导航回退；测试夹具已清理 |
| `playwright test --project=docs-production:*` | 4 通过；桌面/移动端、所有内容路由禁 JS 正文、补水/按需加载、404 |
| `pnpm build:docs` | Node 24/26 静态构建通过；输出 31 篇正文、2 个首页及 404；发布目录附字体许可 |
| `pnpm test:pages` | `/` 与 `/yuzur1ha-oss/` 均通过：移动/桌面、中文/英文、补水、深链刷新、脚本/CSS/favicon、字体许可、404；已查看子路径手机长截图 |
| `node scripts/verify-repository.mjs` | 六包无循环；显式运行环境/源码导入边界及开发文档链接通过 |

本地日志存于忽略的 `test-results/acceptance/`，浏览器截图与 trace 存于 `test-results/`。失败中的迭代运行不计作通过：早期修复了本地资源相对生成目录解析、通配导出测试、主题依赖、GitHub 链接断言及冷启动预构建；并行格式化造成的一次开发热更新干扰已通过稳定文件状态下的完整重跑排除。

## 包消费与分发细节

- 全部 exports 的 JS/声明/资源目标存在；UI 根入口与组件入口类型一致。
- tarball 只含允许的发布文件；没有源码路径别名、源仓库绝对路径、缓存/夹具或生产依赖的 workspace 协议。
- token 在无 React 项目中可用；Markdown 在无 React/Vite 项目中可编译。Markdown 的 React/Vite 是可选 peer；reference 没有多余的 Router peer。
- Press 自定义主题消费者没有安装 UI、token、默认主题或 reference，generate/check/build/dev 均通过；默认主题与 reference 在另一独立消费者中验证。
- CLI shebang 与执行位保留；静态预览在内容和配置已移走时仍可用，缺失页面返回真实 404。
- Button 按需样例为 16,012 字节压缩 JS、18 个 rendered modules（React/Emotion external）；没有 accordion/collapsible、reference 或编译器模块。不是 gzip 数值，也不是整个站点体积。六包原始构建大小见 [基线](build-baseline.json)。
- 字体通过 Fontsource 引用；Docs 分发 WOFF 时附带两份原始 OFL 文本。直接依赖许可清单由脚本从实际安装元数据生成，见 [清单](../../dependencies.json)；不把它当作完整传递依赖法律审计。

## 已知限制与外部步骤

- Linux、Windows 及 GitHub Actions 的实际结果待远端运行；本地通过不能替代这些兼容性证据。
- 工作区继承源项目的开发依赖 `skipLibCheck: true`。额外尝试对整个开发依赖树关闭它，发现上游 `@types/mdx@2` 的旧 JSX 命名空间、Vite/client 的 DOM 类型环境，以及 jest-dom/Vitest Assertion 泛型声明不一致。没有添加全局 JSX shim、伪造不存在的类型版本或放宽公开产物检查；已发布类型边界的两个严格消费者不跳过声明检查并已通过。不能宣称所有上游开发声明均无兼容性问题。
- `changeset status` 在目标尚无首个 main 提交时不能找到分叉点，这是尚未提交的仓库状态；版本传播已在不提交、不发布的临时 fixture 中实际验证。临时测试关闭远端 changelog 查询，不代表 GitHub changelog 集成已验收。
- 对目标 GitHub remote 的只读探测遇到当前认证失败，不能由此断言仓库不存在。六个 npm 包的匿名 registry 查询均为 404；这只表示本次未看到公开版本，不证明 scope 权限或包名所有权。
- 首发前按 [runbook](../../operations/runbooks/release.md)核实仓库/scope、GitHub App、Actions、Pages source/environment；维护者 bootstrap npm 首发后逐包配置 OIDC，再启用发布变量。届时实际执行 registry 回归、provenance、Pages 访问与部分发布重试验收。

## 文档语言分工调整验收

后续用户要求已覆盖旧的子包双语约定：仅根 README 保留双语；六包及应用 README 为简要英文，删除 6 份子包中文 README 与 4 份旧中文指南；全部第三方声明和 Changeset 摘要英文。`docs/*` 保持中文供审阅。

- Markdown 英文指南补齐编译、元数据、插件/指令、Vite、类型 shim、资源和错误边界；保留排版示例。
- Press 英文指南补齐最小站点、配置、命令、公开入口、内容生命周期、主题/正文渲染、headless Vite、语言和部署 base。
- 中文首页及 Markdown/Press 页面只保留翻译进行中的提示和英文入口；相应语言切换与生产标题断言按新要求更新。
- 根包保留 `@changesets/cli` 与 `@changesets/changelog-github` 标准链路；`.changeset/README.md` 与实际安装 CLI 的 `default-files/README.md` 逐字一致，没有改写官方模板或另建 `.changesets/`。
- 迁移源仓库仍为只读参考：893 文件 SHA-256、HEAD、工作区和暂存状态复核通过。

本轮实际执行（Node 26.5.1、pnpm 11.18.0）：

| 检查 | 结果 |
| --- | --- |
| `pnpm check` | 构建、内容生成、lint、类型、42 份 Markdown 链接/包边界及格式检查通过 |
| Docs Vitest | 6 文件、29 测试通过 |
| `node --test scripts/tests/*.test.mjs` | 5 测试通过，包括 Changesets 真实版本传播 |
| 六包 `pnpm pack` + tar 内容审阅 | 每包均只有英文 README/第三方声明，没有中文 README/GUIDE；发布 files 清单同步 |
| Docs 静态构建 | 通过；31 篇正文、2 个首页和 404 生成 |
| 针对文档的浏览器回归 | 32 通过，覆盖排版、阅读/语言切换、导航、加载与响应式 |
| 生产浏览器回归 | 4 通过，覆盖全部路由无 JS 阅读、中文占位标题及补水 |

5173 端口已有用户启动的本项目 Docs 服务，经核对进程工作目录后，通过忽略的临时 Playwright 配置复用它执行上述 32 项检查，未终止该服务，也未改变正式测试配置。本轮没有重新执行全部 322 项 UI 浏览器场景；前面的全量结果属于迁移阶段历史证据。详细日志位于忽略的 `test-results/acceptance/`，截图/trace 位于 `test-results/docs-review-browser/`。
