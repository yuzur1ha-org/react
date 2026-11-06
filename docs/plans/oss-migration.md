# Yuzur1ha OSS 迁移计划

状态：Draft（执行计划初稿）。2026-11-04 用户明确授权按计划实施；实际结果记于[验收](../features/oss-migration/acceptance.md)，需求与任务使用[稳定 ID](../features/oss-migration/README.md)。

2026-11-04 后续要求覆盖原语言约定：仅根 README 双语；子包文档与第三方声明英文；使用官方 Changesets 初始化 README 和英文摘要；站点中文页改为翻译占位；`docs/*` 继续中文审阅。

## 目标与决策

从源 yuzur1ha 只复制 apps/docs、packages/* 及其最少必要配置/资源至 yuzur1ha-oss。源目录不修改、移动、删除或格式化，不修改其依赖/Git配置/暂存状态；目标无源路径或软链接依赖。记录源 HEAD、文件 SHA-256、Git 工作区状态以便结束后复核。

确认 GitHub 按 soppylzz/yuzur1ha-oss 配置（存在性与权限待核实）；MIT，第三方保留各自许可。六包 @yuzur1ha/*，首版均 0.1.0，之后独立版本；ESM-only，Vite 构建，无后缀 TS 相对源码导入；Node24/26；GitHub Pages；Docs 本地资产，无 assets 公开包；仅根 README.md/README.zh-cn.md 双语，六包 README 简要英文。

初始目标为空。源包未发布、源仓库无 LICENSE；不能继承源项目验收成功或发布状态。

## 迁移与包设计

迁入四包源码、Docs 内容与示例、单测、Docs 浏览器测试、必要根配置和测试辅助代码。按引用清单补充 Docs SVG/favicon/图片、README wordmark、有关架构和 API 指南；改写相对链接。保留真实 Figma 来源但构建/测试不依赖登录。

不复制其他业务应用、后端文档和规则、服务/基础设施占位目录、密钥、本地数据、node_modules、缓存、测试报告和 dist。重新生成唯一目标锁文件。

| 包 | 职责与入口 | 依赖边界 |
| --- | --- | --- |
| token | 根、markdown、CSS、字体、HeroUI 适配 | 无 React/UI/Press |
| ui | Provider、组件、显式子入口与就近类型 | token；React/DOM/Emotion peers |
| markdown | 编译、plugins、vite、client shim | 无 Press/UI/文件发现/站点策略 |
| press | content/node/vite/site、CLI、SSG、无样式 react 契约 | markdown；无 UI/Emotion/默认主题 |
| press-theme | 默认 React 布局、导航、主题、加载/错误/404 | core 公共契约、UI、token |
| press-reference | Demo、API、源码展示 | core 公共契约、UI、token；无 Docs/默认主题 |

不继续拆内部工具包、不制造通用抽象。保留组件就近 .types.ts；跨包只用构建后的公开入口；禁止循环。

配置从 @yuzur1ha/press 导入 defineConfig。theme 为完整主题模块，Docs 显式 @yuzur1ha/press-theme；document 为可选本地渲染器，接收 metadata/Content。生成器从配置生成根布局、文档、首页、加载、错误边界、404 的导入；不硬编码默认主题。自定义主题不需要默认主题/reference。Docs 自行组合 reference。旧 reference 入口和视觉 react 导出迁往新包；尚未发布，不保留旧兼容代理；逐项记录迁移表。

Token JS/CSS 同源生成，字体/适配可选；UI 保留 ref/Portal、受控契约、可访问性和局部主题，消费者传入文案；Markdown 保留错误位置、sourcemap、插件与依赖追踪；Press 生成集中 .cache/press，明确配置、路径、监听、SSG 生命周期。Docs 使用完善的英文指南；中文页面仅保留翻译进行中的简要说明。

## 工程与产物

先建立 pnpm、质量工具、hooks、Changesets、CI/CD 和 Agent 再迁实现。根和 Docs private，workspace 仅 apps/_、packages/_。固定 pnpm、唯一锁文件、CI frozen；沿用源主版本并核实真实版本/engines/peers；共享开发版本使用 catalog。pnpm 拓扑构建，不引入调度框架。

根提供 dev/build/build:packages/build:docs/lint/typecheck/format:check/check/test:unit/test:e2e/test:package/changeset/version-packages/release。check 先准备包与内容再静态检查，单测、浏览器和发布验收独立。

ESLint flat config 按 Node/浏览器/测试配置，严格类型、Hooks、可访问性；Prettier 最后。Commitlint Conventional Commits 英文主题；Husky pre-commit lint-staged，commit-msg 校验。保留默认暂存保护，不运行 git add；CI 独立全量检查。

六包 Vite library ESM，dependencies/peers 及子路径 external；token 随后生成 CSS。源码 Bundler 解析和无后缀导入；tsc 临时输出声明，AST 处理 file/directory/import type/shim 引用再写 dist；不留下 #imports/工作区别名。所有引用可解析，NodeNext/Bundler 严格消费者 skipLibCheck=false。JS maps 含源码内容；没有有效源的声明 map 不发布。

包补齐描述、版本、MIT、repository.directory、homepage、bugs、keywords、public access、显式 exports、files 白名单与 sideEffects。UI 无无限通配；CSS 正确保留。workspace:^ 在 tarball 转换真实范围；React/DOM/Emotion 不打入包，纯内容/编译入口无需视觉依赖；CLI 验证 shebang/权限/Windows。

## CI/CD、Agent 与文档

独立 Changesets，无 fixed/linked；公开行为需记录，纯文档/内部维护可空 changeset 但说明原因；0.x 破坏变化写迁移。

PR/main 门禁：frozen、格式/lint/类型/内容、单测、六包/Docs build、工作区外 tarball、生产浏览器、Pages 根/子路径；Linux Node24/26，Windows CLI/路径；失败上传证据、不使用 passWithNoTests。

main 通过门禁后用 GitHub App token 维护可触发 CI 的版本 PR。合并后验证同一提交再发布；串行、不取消、不覆盖版本；部分失败重试跳过已发版本、不自动 unpublish。首发维护者认证 bootstrap；后续逐包 npm OIDC，核实 scope/包名/CLI/trust/environment。Pages 默认 /yuzur1ha-oss/，同时测试 /；验证导航/语言/资源/深链/刷新/404。文档和 npm 分别报告状态。Actions SHA 从官方 remote 核实，job 最小权限、不复制凭据。

Agent 提炼 root/context 与 workflow/engineering/frontend/packages/testing/release/commits/comments/docs，角色保留 API/前端/文档/验收/发布。流程：需求用例→公开 API/包边界→必要 UI 设计→实现→产物消费验收→发布。无 Go/DB、历史产品授权、自动委派。Agent/注释英文，开发文档简中，仅根 README 双语同步，子包说明、第三方声明与 Changeset 英文；用户改动、未知 TBD 与实际证据保留；commit/push/外部操作依当前授权。

README 参考当前双语结构及 soppy-vue/soppy-slidev：定位、包表、安装/最短例、Docs、开发、状态、MIT。每包写入口/peer/环境/样式/限制。提供架构、贡献、测试、runbook、迁移表。无实际发布不展示 npm badge；计划地址不冒充部署成功。

## 阶段与验收

| 阶段 | 交付与完成条件                                              |
| ---- | ----------------------------------------------------------- |
| P0   | 清单/引用/源基线、需求和测试计划；识别最少依赖              |
| P1   | 工程、hooks、Changesets、CI/CD、Agent；干净安装与检查可运行 |
| P2   | 六包/契约/构建；无循环且入口完整                            |
| P3   | Docs/本地资源/根双语与子包英文文档；独立运行与静态构建      |
| P4   | tarball/兼容矩阵/浏览器/许可；本地阻断项清零                |
| P5   | npm/OIDC/Pages/registry；有真实外部证据                     |

P5 在产物可审查后按明确发布授权执行；仓库、scope 和 Pages 权限待真实配置。

验收所有 exports 文件与类型、UI 根/子入口类型一致；工作区外 tarball 无源码 alias/预热离线缓存/硬编码版本，NodeNext/Bundler 严格类型；无私有路径、缓存、夹具、workspace 协议或不明许可资源。

覆盖 token 无 React/CSS/字体，UI 按需/主题/Portal/键盘/SSR，Markdown 编译/错误/插件/追踪，CLI generate/check/dev/build/preview/错误/监听，默认与自定义主题、reference 可选安装，客户端无构建服务、tree-shaking 和体积基线。Docs 覆盖静态正文/无 JS/补水/移动桌面/浅深色/Demo/API/源码/中文/资源/深链。

CI 验证 PR 无发布权、失败阻止发布、版本 PR、重复与部分失败恢复。发布后 registry 消费不能由本地 tarball 替代。复核源文件哈希和 Git/暂存；并发外部变化单独报告。最终交付源码、配置、Docs、双语/Agent、锁文件、CI/CD、迁移表、许可和验收。记录环境、命令、基线、结果，区分已实现/本地验证/CI验证/已发布。
