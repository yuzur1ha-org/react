# YuPress 完善验收记录

状态：已实现、本地已验证。日期：2026-11-04。没有执行提交、推送、npm 发布或线上部署；以下不是外部 CI/Windows 验证证据。

后续反馈：用户仍观察到 Chrome 原生窗口拖动期间的字间距/粗细变化，REQ-012 的实时呈现问题重新调查；此前稳定状态检查不足以证明它已解决。品牌 inset 已按新要求统一，见 [复查记录](resize-follow-up.md)。

需求、审阅依据与 API 设计见 [计划](../../plans/press-polish.md)，入口调整见 [API 迁移表](../../architecture/api-migration.md)。目标仓库尚无提交，本轮使用文件哈希基线记录实现，而不虚构 commit。文件基线见 `file-baseline.json`，体积见 [构建指标](build-metrics.json)。

## 实现与证据对应

| 需求 | 实现 | 本地证据 |
| --- | --- | --- |
| oss-migration:REQ-008 | Markdown 6 页、YuPress 7 页；保留概览和主要旧锚点链接；英文子页与中文占位回退 | 导航/分页/旧锚点/缺译用例；根与 Pages base 深链接；全路由无 JS 阅读 |
| oss-migration:REQ-009 | 根 README 中英对齐，补充六包选择、四类示例、peer/样式/字体和发布状态 | 本地链接、格式和构建检查；根双语，其余包说明保持英文 |
| oss-migration:REQ-010 | Token tableStyles 由 GFM/API 共用；三种列对齐、底分隔、轻表头、11px code；Press 键盘横向滚动 | 桌面/手机、浅深色、长表、原生 table 结构与键盘滚动，Chromium/WebKit 均通过 |
| oss-migration:REQ-011 | 全局 range 查询与共享 mediaQueries；手机 Form/Modal 统一；内容/容器断点保留 | 分数宽度、639/640、1023/1024、600/768/900 场景；旧查询回归守卫 |
| oss-migration:REQ-012 | 品牌 21/32、手机 19/28；侧栏 14/20；Press 导航选中不再随断点切换 scale；模糊背景移至伪元素 | 两浏览器、开发/生产、DPR 1/1.25/2、浅深色、reduced-motion、字体延迟加载；同档指标及往返 resize 品牌截图一致 |
| oss-migration:REQ-013 | Markdown 通用元素扩展；Press session 编译服务与 Shiki；核心复制状态；UI CodePanel；可选主题视图；Reference 独立适配 | 多语言/允许列表/双主题/未知回退/HTML 校验/嵌套/原文复制/失败与过期清理/SSR/自定义主题/配置 watch/隔离 tarball |

## 工具与环境

- macOS 27.0.1（26A434），arm64；Node 26.5.1 与 24.22.2。
- pnpm 11.18.0；TypeScript 5.9.3；Vite 8.3.5；Shiki 4.6.0。
- Playwright 1.64.1，Chromium 与 WebKit 27.2（v2370）。本轮安装了缺少的 WebKit 测试运行时。
- `.changeset/README.md` 与已安装 Changesets CLI 的 `default-files/README.md` 通过 `cmp`，未自定义改写。新增变更摘要为英文。

## 执行结果

| 命令/检查 | 结果 |
| --- | --- |
| `pnpm check` | 六包构建、内容生成、ESLint、TypeScript、包边界/链接/断点契约、Prettier 通过 |
| `pnpm exec vitest run --maxWorkers=3` | 66 个文件、260 项通过 |
| `node --test scripts/tests/*.test.mjs` | 5 项通过，包含声明引用与 Changesets 版本传播 |
| Node 26 `node scripts/verify-packages.mjs` | 六包在线安装到独立临时消费者，Bundler/NodeNext `skipLibCheck:false`、所有入口/CLI、源码 shim、SSG/preview、最小依赖与 tree shaking 通过 |
| Node 24 同上 | 相同六包与消费矩阵通过 |
| `playwright test --project=docs:* --workers=3` | 321 项通过、1 项原有移动端指针 hover 跳过；未增加 skip |
| `playwright test --project=docs-polish:* --workers=2` | Chromium/WebKit 共 12 项通过，包含连续 resize、分数宽度、字体延迟、复制/表格与链接 |
| `playwright test --project=docs-polish-production:* --project=docs-production:* --workers=2` | 16 项通过，含所有内容路由无 JS 阅读、生产补水与按路由加载 |
| `playwright test --project=docs-content:*` | 1 项通过，覆盖内容错误、缺失引用、删除与恢复 |
| `pnpm test:pages` | 根路径与 `/yuzur1ha-oss/` 的桌面/手机、资源/许可、刷新、语言、404、旧锚点跳转与代码块通过 |
| 最终根路径 Docs 构建 | 42 个内容页面的站点构建成功；最终 dist 恢复为根 base；计时 real 5.52s |
| 浏览器产物审计 | Shiki/Prism/Node 构建模块 0，WASM 文件 0；源码高亮随静态 HTML 输出 |
| `node scripts/verify-source.mjs /Users/soppylzz/code/package/yuzur1ha` | 893 个 SHA-256 一致，原 HEAD、工作区和空暂存 diff 保持 |

tarball 的独立消费者没有安装默认主题/UI/token/reference 时，自定义主题仍可构建并通过核心 CodeBlock fallback 输出代码。Reference 单独 SSR 也通过，无需默认主题 Provider。Button 按需消费基线为minified JS 15,765 bytes（未 gzip）、18 modules，没有引入其他组件或编译服务。

## 细节修正与验收解释

- WebKit 的有效媒体查询宽度会扣除当前 6px gutter；iframe 分数宽度也会被浏览器量化。验证按实际媒体档位比较同档排版，同时断言档位互斥、连续和组件一致，不用修改全局阈值补偿浏览器。
- 原生可聚焦滚动区在 WebKit 上未可靠响应横向方向键，Press 表格与 CodePanel 增加局部方向键处理；不拦截子控件与组合快捷键。
- 发现 Docs 的旧预构建缓存可能保留已重建库的样式；现以库 JS 产物哈希隔离 Vite cache，并提前扫描 TSX、React/Emotion runtime，避免增量优化混入不同 React 模块身份。普通新增用例同时检查 pageerror 和 console.error。
- 去掉 token 排版中对 SSR style 兄弟节点敏感的 first-child 规则，保留首段/后续标题间距；原有结构间距断言通过。
- 像素测试等待字体与实际 focus transition 完成，仍逐像素比较 NumberField 边框；没有关闭动画断言或放宽像素相等要求。
- 代码复制使用 parser 正文或原 TSX 字符串。相同浅深色 token 不重复存储 darkColor，避免默认 token 主题产生不必要的重复数据。Demo 不再为 Prism 懒加载单独源码 chunk，折叠仍保留。
- 先完整校验原 HTML，再分析和递归替换，避免被移除的标题或被替换的 pre 绕过策略。自定义项目编译服务在分析后正确添加部署 base，且不重复添加已存在的 base。
- 中间验证曾暴露陈旧 Prism selector、拆页后不再足够长的锚点用例、SSR 选择器警告及高并发检查超时；均在保留功能断言的前提下修正/按有界并发重新验证。最终结果以上表为准。

## 体积与限制

本轮开始已有产物 HTML 6,702,030 bytes、客户端 JS 1,244,760 bytes；最终 HTML 8,004,745 bytes（45 文件，逐文件 gzip 合计 999,539）、JS 1,693,087 bytes（121 文件，逐文件 gzip 合计 418,551）。本轮新增 11 个指南页面，并将高亮 token 预编译进各页面，因此总量不是相同输入下的性能对比；不能据此宣称体积下降。旧构建没有可比较的整体计时。本轮最终完整 Docs 构建为 5.52 秒。

代码高亮没有进入客户端引擎包，代价是静态 markup 与序列化 token；实际请求仍按文档分块。指标不替代真实用户网络性能测试。Windows、Linux/GitHub CI、线上 npm 和 Pages 未在本机验证；原迁移记录中关于全体开发依赖严格检查的限制仍有效，公开声明消费使用 `skipLibCheck:false`，未以放宽该设置规避问题。

原始成功日志及截图保存在本地忽略目录 `test-results/acceptance/press-polish/`，开发/生产 resize 字体截图与代码浅深色截图分别归档；可通过表中命令重新生成。
