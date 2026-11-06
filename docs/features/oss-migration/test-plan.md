# 迁移测试计划

- REQ-001：比较 source-baseline.json 的文件 SHA-256、HEAD、Git 工作区及暂存状态；报告并发外部变更。
- REQ-002：frozen install、pnpm check；测试 AST 声明转换的文件/目录/import type/失败分支；检查 hooks、commitlint 与独立版本配置。
- REQ-003/006：六包 build、单测；工作区外安装 tarball；NodeNext 与 Bundler 严格类型检查（skipLibCheck false）；CSS、字体、所有导出路径、CLI 和 Node 24/26。
- REQ-003：默认主题、自定义主题、reference 可选安装；检查核心依赖和客户端 chunks，验证 tree-shaking 样例与体积基线。
- REQ-004：Docs 内容契约、完整开发浏览器套件、生产 SSG、无 JS 正文、移动/桌面、浅深色、导航、Demo/API/源码预览；根路径及 /yuzur1ha-oss/ 的静态服务验收。
- REQ-005：根双语与子包英文链接/示例、许可证、第三方资源来源与发布文件白名单。
- REQ-007：CI 真实运行、npm registry 安装、Pages 访问与 OIDC 首次配置须在外部发布阶段验证，不能由本地测试替代。

测试失败先定位契约与实现，不能通过移除断言或全局放宽检查掩盖失败。
