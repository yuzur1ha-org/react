# YuPress 文档、响应式与代码展示完善

状态：已实现并通过本地验收，详见 [验收记录](../features/press-polish/acceptance.md)。当前任务授权本地实现与验收，不包含提交、推送、发布或部署。

## 需求与任务

| 需求 | 交付 | 任务 |
| --- | --- | --- |
| oss-migration:REQ-008 | Markdown 六页、YuPress 七页英文指南与旧锚点入口 | oss-migration:TASK-008 |
| oss-migration:REQ-009 | 根双语 README 的包选择、四类示例、依赖和状态 | oss-migration:TASK-009 |
| oss-migration:REQ-010 | Token 共享表格基础、GFM/API 对齐及可访问滚动 | oss-migration:TASK-010 |
| oss-migration:REQ-011 | 统一 640/1024 全局断点、保留内容与容器断点 | oss-migration:TASK-011 |
| oss-migration:REQ-012 | 品牌 21/32、手机 19/28，侧栏 14/20；导航取消跨档文字缩放 | oss-migration:TASK-012 |
| oss-migration:REQ-013 | Node Shiki、标准语法增强、CodePanel、复制与配置契约 | oss-migration:TASK-013 |

## 审阅依据与视觉约束

独立 reviewer 已审阅方案。原导航跨 1024px 切换 emphasis，测得 scale 过渡；品牌行高 31.5px、侧栏 19.6px 为候选因素，同档静态指标基本稳定，不作为全部抖动根因。实现取消 Press 导航的断点状态切换，固定行盒，将侧栏模糊背景移至伪元素。通用 Menu 的显式 emphasis 与 TOC 阅读强调保持。

表格以现有 Schema/API 的 12px/1.7、轻表头、底边分隔线、12px 16px 单元格为依据。手机 padding 12px；code 11px 等宽。保留 Markdown 三种对齐，不强加 API 的 640px 最小宽度。

全局 phone `<640`、tablet `640<=width<1024`、desktop `>=1024`。600px 手机规则统一；404 768px 与色板 900px 是内容断点，Demo 640px container 是容器断点。高度、指针、forced-colors、reduced-motion 独立处理。

## 编译与运行时契约

- Markdown 提供通用 elementRenderers，不依赖 Press/Shiki/UI。校验原 HTML，先 analyze，再递归替换；保留源码位置与 children 选择。
- Markdown AST 转换记录 code/table 的原始 offset，在 raw HTML 规范化后恢复来源标记，避免把 authored pre 误认成代码围栏。代码正文使用 parser 原值，不依赖 HAST 自动追加的换行。
- Press ProjectContext 增加 compileDocument/highlightCode；默认编译器与 Docs 插件都走统一服务。Shiki 4.6.0 仅 Node，实例 session 内懒加载并释放。
- code 支持 highlight/theme/copy/lineNumbers/languages；false 禁用增强。默认 token 配色，普通块无行号、Demo 保留行号。未知围栏回退，非法配置失败。内置双主题输出统一 token 分段，避免不同主题 token 边界错配。
- 核心 React CodeBlock 管理复制与生命周期、无样式 fallback；UI CodePanel 为纯展示组件。主题可选 CodeBlockView 自动安装，Reference 显式适配同一面板，均无反向依赖。
- 复制原代码，不 trim、不读 DOM；2 秒恢复、失败重试、过期 promise 与卸载清理。SSG 预含正文，按钮就绪前隐藏且不挤占正文。

## 验收

运行静态检查、单元、Node 24/26 tarball 严格类型消费；验证默认/自定义编译、嵌套、HTML 策略、语言与配置回退、精确复制与异步清理。开发与生产 Chromium/WebKit 验证响应式、字体、表格、导航、无 JS 和补水。记录真实结果、体积与耗时；未执行项不能记为通过。源仓库继续使用原哈希与 Git 基线核验。

补充验收发现：WebKit 会从有效媒体查询宽度扣除 6px gutter，按浏览器实际档位断言，不能把 window.innerWidth 直接当作媒体查询宽度。表格和代码面板为缺少原生方向键滚动的引擎补充横向键盘处理；普通控件键盘行为不被拦截。Docs 使用库产物哈希隔离 Vite 依赖缓存，并在首轮扫描所有 TSX/React/Emotion runtime，避免工作区旧包和增量预构建混用。项目编译服务在分析后对内部绝对链接应用部署 base，旧锚点入口在 Pages 子路径下同样工作。
