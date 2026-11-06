# 发布流程

## 首次准备

确认 soppylzz/yuzur1ha-oss 仓库与 main 分支、npm @yuzur1ha scope 权限、包名可用性、MIT 与第三方资源许可。仓库是否存在及账号权限必须实际检查。

启用 GitHub Actions 创建 PR。配置专用 GitHub App（Contents/Pull requests 写权限），设置 APP_ID 与 APP_PRIVATE_KEY，以便版本 PR 能触发 CI。配置 github-pages environment 与 Actions Pages source。工作流不会自行创建账号或授权。

## 首发与后续版本

1. 在干净 checkout 安装并运行 pnpm check、test:unit、test:package 和 test:production。
2. 核对六包 0.1.0 的白名单、依赖范围、README、LICENSE；bootstrap 前先确认所有名称归属。
3. 经当前任务发布授权后，由维护者在认证终端运行 pnpm release 完成首次发布。不要在源码保存 token。
4. 每包配置 npm Trusted Publisher：GitHub owner/repo/workflow 与 release environment 必须匹配；使用 GitHub-hosted runner，给予 id-token: write。按 npm 官方要求核实 CLI 版本。
5. 启用仓库变量 RELEASE_ENABLED=true；后续 main 通过质量门禁后运行 Changesets action，生成版本 PR 或发布尚不存在的版本。版本 PR 合并前检查 CI。
6. 发包后在工作区外从 registry 安装并执行类型、CLI、SSG 烟测，检查 npm 元数据和 provenance；记录实际版本、提交、网址和结果。

## 文档发布与恢复

Pages workflow 先执行质量与产物验证，再构建 base=/yuzur1ha-oss/ 并上传 Pages artifact；启用 PAGES_ENABLED=true 后部署。独立域名需另改 base 并重新验收。

发布失败先核对 registry，已成功版本不重复改写。对同一提交重试，Changesets 跳过已有版本；不得自动 unpublish。Pages 失败独立重试，不能因此重复发包。未创建仓库、未配置凭据或外部 Actions 未运行时，状态保持“本地已验证/外部待配置”。

## Changeset 文案

根包沿用 `@changesets/cli` 与 `@changesets/changelog-github` 的标准生成链路。运行 `pnpm changeset` 交互生成记录，摘要统一英文，生成的 CHANGELOG 因而采用英文。`.changeset/README.md` 使用 CLI 自带初始化模板，不改写为项目说明；详细操作记录放在本文。六包独立版本不继承 soppy-vue 的 linked 分组。
