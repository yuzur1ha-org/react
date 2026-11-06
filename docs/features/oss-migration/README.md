# OSS 迁移需求与任务

状态：Approved（需求），2026-11-04 用户要求实施计划。实现与验证状态见验收记录。

| 需求 | 成功条件 | 实施任务 |
| --- | --- | --- |
| oss-migration:REQ-001 | 源目录内容、暂存与工作区状态保持不变，目标无源路径依赖 | oss-migration:TASK-001：基线、复制与复核 |
| oss-migration:REQ-002 | pnpm、质量工具、hooks、Changesets 和 CI/CD 可独立使用 | oss-migration:TASK-002：基础配置与锁文件 |
| oss-migration:REQ-003 | 六包职责明确、无循环，ESM 与声明可消费 | oss-migration:TASK-003：拆包、构建与导出 |
| oss-migration:REQ-004 | Docs 内容/示例可运行，支持 Pages 子路径 | oss-migration:TASK-004：资源、主题、路由与浏览器验证 |
| oss-migration:REQ-005 | OSS Agent、根双语 README、子包英文说明、MIT 与英文资源声明完整 | oss-migration:TASK-005：开源文档 |
| oss-migration:REQ-006 | tarball 在独立消费者中通过严格类型与运行验证 | oss-migration:TASK-006：产物验收 |
| oss-migration:REQ-007 | 发包、OIDC、Pages 与 registry 回归有实际证据 | oss-migration:TASK-007：外部发布（待发布授权与账号设置） |
| oss-migration:REQ-008 | Markdown/YuPress 多页英文指南与旧入口 | oss-migration:TASK-008：指南拆分 |
| oss-migration:REQ-009 | 根双语 README 的示例、选包、依赖与状态一致 | oss-migration:TASK-009：README 完善 |
| oss-migration:REQ-010 | GFM/API 共用表格视觉与可访问滚动 | oss-migration:TASK-010：表格基础 |
| oss-migration:REQ-011 | 全局断点一致，内容/容器断点有明确用途 | oss-migration:TASK-011：响应式归一 |
| oss-migration:REQ-012 | 品牌/侧栏稳定，Press 导航不随断点缩放 | oss-migration:TASK-012：字体稳定性 |
| oss-migration:REQ-013 | Shiki 构建期高亮、标准语法复制和统一配置 | oss-migration:TASK-013：代码展示 |

后端 API/数据库设计 N/A：项目仅提供前端包及 Node 前端构建工具。视觉沿用迁入实现，Figma 链接保留为来源，不宣称本轮重新对照设计验收。

本轮完善见 [实施计划](../../plans/press-polish.md) 和 [本地验收](../press-polish/acceptance.md)。
