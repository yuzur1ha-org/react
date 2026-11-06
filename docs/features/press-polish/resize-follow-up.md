# Chrome 连续缩放字体反馈复查

状态：品牌留白已修正；用户反馈的实时字间距/粗细变化仍待实机复现，不将其记录为已解决。

## 用户反馈与确定问题

复现环境为 Chrome、`http://127.0.0.1:5173/ui/foundations/`。用户观察到频繁拖动窗口时字间距与粗细变化，并要求 tablet/desktop 的品牌留白一致。用户随后明确确认：Chrome 原本即为 100% 缩放，仍会变化。不能继续把普通页面缩放比例视为已确认原因。

已确认品牌水平位置在 1024px 处变化 8px：侧栏品牌父容器使用 `--yu-header-inset`，其 desktop 为 32px、tablet 为 24px。该位移与字体字重不是同一问题。现在增加 Press 自有品牌 inset：tablet/desktop 均为 32px，手机保留 20px；首页与文档页统一，导航控件原有响应式 inset 保留。

## 上次验收的边界

上次把停止缩放后截图一致和文字容器尺寸稳定概括成“字体稳定”，结论过宽。侧栏文字 span 使用 flex:1，其盒子宽度不代表实际文字宽度；自动化 viewport resize 也不能完整代替用户拖动 Chrome 原生窗口时的呈现。

本次在 Foundations 上补充实际 Range 文本宽度、逐字符位置，以及连续 120 个 RAF 帧采样；同时覆盖正常的品牌 inset 与手机切换。

## 实际诊断证据

- 独立原生 Chromium 窗口缩放的 253 帧中，菜单盒子/字体指标未变化；品牌只有 tablet/desktop inset 的两种位置。
- 同一档位连续变化宽高时，分别捕获品牌与首个菜单项 30 次图像；原样式和禁用 backdrop-filter 对照中，各自均只有一种图像和一种布局指标。这些快照不能证明原生窗口拖动期间每个显示帧都一致，也不能证明 blur 是根因。
- 用户当前开发服务位于 OSS 的 apps/docs，未把原仓库误当作目标。
- 用户已确认 Chrome 页面缩放为 100%。当前 Chrome 控制连接不可用，未读取其显示缩放、实际 DPR 与合成配置；没有通过读取浏览器 profile 绕过连接。
- CSS、逐字符排版与屏幕上的实时栅格呈现是不同层面。当前证据没有证实字重/字距 CSS 持续切换，也没有足够证据把粗细闪动认定为 GPU、blur 或可变字体故障。

## 验证与后续

已完成主题构建，Chromium/WebKit 开发态 6 项定向检查通过：Foundations 逐字符指标、120 帧采样、DPR 1/1.25/2 往返 resize、首页/文档品牌 32px 与手机 20px。生产态相同的 6 项也通过。ESLint、全工作区 TypeScript 检查通过；源仓库 893 个文件及 Git 状态仍与基线一致。

诊断数据与图像保存在本地忽略目录 `test-results/resize-diagnosis/`，检查日志为 `/tmp/oss-resize-*.log`。上一轮 file-baseline.json 是上一轮历史快照，本次修改不会倒填进该基线。

补充排查：在受控页面顶部连续触发 36 次 resize，根容器 style mutation 为 0、实际样式变化为 0，scrollY 始终为 0。该场景没有证实根级样式反复写入，不能将它认定为原因。

下一步需要能够看到实际拖动与异常帧的录屏，或连接现有 Chrome；100% 缩放条件已经确认，无需重复询问。应依据实际异常帧继续定位；不通过 font-smoothing、translateZ、强制字重或禁用断言掩盖现象。库产物更新后需重启 Docs 开发服务，确保客户端使用本次构建结果。

## yu-link-content 定位补充（2026-11-06）

用户进一步指出异常发生在 `yu-link-content`。该元素由 `packages/ui/src/components/link/link.tsx` 的 `LinkUnderline` 创建，实际为同时带有 `yu-link-hover-line` 的 span。其排版来源有三处：

- `link.styles.ts` 的 `linkUnderlineStyles` 设置 `font: inherit`、相对定位、最小宽度和换行规则；260ms 的 transform 过渡仅作用于 `::after` 下划线，不作用于文字本体。品牌传入 `underline={false}`，当前页面该伪元素的 computed content 为 `none`。
- `press-theme/src/header/brand.tsx` 将该 span 设为 flex，居中对齐并使用 12px gap；字体从品牌链接继承。只有手机断点改变品牌字号、行高和图标尺寸，tablet/desktop 没有字体切换规则。
- `press-theme/src/navigation/sidebar.tsx` 的父容器在 96px 高度内垂直居中，并带 1px 底边框。当前内容盒实际 y 为 31.5px；它来自 95px 内容高度中的居中计算，尚未观察到其在 resize 中往返变化，不能据此认定为根因。

对当前 5173 开发服务的独立 Chromium 探测覆盖 1280、1100、1024、1023、800px 并返回 1280px，同时改变窗口高度。该 span 始终为 `(32, 31.5, 174.59375, 32)`，字体为 `500 21px/32px`，字距为 `-0.735px`，transform/scale 均为 none。

扩展已有逐帧回归，额外检查该 span、品牌链接及品牌父容器的节点身份、类名、矩形、字体、字距、transform、scale、gap、对齐、伪元素与运行中的动画。48 次 viewport resize、120 帧采样在 Chromium/WebKit 共 2 项检查通过；定向 ESLint 与 Docs TypeScript 检查通过。原仓库 893 个文件及 Git 状态仍与基线一致。原始探测输出为 `/tmp/oss-link-probe.json`，测试日志为 `/tmp/oss-link-content-tests.log`。

本次仅增加诊断回归和记录，未根据猜测修改 Link 的公开行为；用户 Chrome 原生拖动时的实时异常仍未复现，问题保持开放。侧栏菜单使用独立的 MenuItem/yu-menu-text 实现，不经过 yu-link-content，二者不能直接视为同一条组件渲染链。

## 固定品牌内容宽度

用户进一步要求固定 width。默认主题现在为品牌链接预留 180px，`flex: none` 禁止收缩；内部 `yu-link-content` 占满该固定区域，同样禁止收缩。标题使用剩余空间并保持单行省略，logo 尺寸不变；没有修改通用 UI Link 的布局契约。tablet/desktop 继续保持 32px 品牌 inset，手机保持 20px。

180px 能容纳当前品牌，同时给 320px 手机窗口的导航控件留出空间。父容器确实小于预留空间时仍受 `max-inline-size: 100%` 约束，避免任意长标题或极窄宿主造成溢出。首次尝试的 191px 在 320px 手机布局中实际只能获得 190px，因此最终选择更小的固定空间，而非删除手机边界检查。

测试还捕获过一次初始字体加载造成的实际字形宽度变化，而 computed font 未变；这提示仅等待一次 `document.fonts.ready` 不能可靠表示动态样式所需字体已就绪。字体就绪后的 resize 检查现在显式加载品牌/菜单所需字重，保留独立的延迟字体加载行盒检查；不将首次字体替换归因于持续 resize，也不将显式等待视为运行时修复。WebKit 的布局分支按照实际 matchMedia 选择，以包含滚动条对临界视口的影响。

主题产物已重新构建；本轮没有重建共享的 Docs 生成目录，以避免干扰用户运行中的 5173 服务。现有服务可能仍持有 Vite 预构建模块，用户需重启该开发服务后检查本次库样式。原生 Chrome 的实时拖动效果仍需确认，不将固定宽度实施等同于所有字体抖动已解决。

本轮最终本地验收：Chromium/WebKit 共 8 项定向检查通过，覆盖首页/文档页 320–1280px 固定宽度、长标题省略及页面无横向溢出、品牌 inset、字体加载行盒和字体就绪后的逐帧 resize。定向 ESLint、Docs/主题 TypeScript、修改文件格式检查通过；原仓库内容与 Git 状态未变。日志为 `/tmp/oss-brand-width-{build,tests}.log`。本轮未执行生产 Docs 构建或外部 CI。

## 固定宽度后的绘制排查

用户确认容器不变时，viewport 变化仍有抖动。再次对当前 5173 服务独立测量：通过 CDP `CSS.getPlatformFontsForNode` 在 40 次 viewport resize 中检查实际字形字体，品牌始终为自定义 Instrument Sans Medium，菜单始终为自定义 Instrument Sans Regular；实际字体与文字几何只有一种状态。另一次不查询平台字体的 40 次 resize 也只有一种文字几何状态。

观察到 FontFaceSet loading/loadingdone 事件，涉及已加载的 Instrument Sans Variable 与 JetBrains Mono Variable，但该组测量没有观察到目标文字切换为其他字体。FontFaceSet 事件不能直接当成网络重复下载或目标文本 fallback 的证据。原始数据为 `/tmp/oss-font-paint-probe.json`、`/tmp/oss-font-paint-no-inspector.json` 和 `/tmp/oss-font-events.json`。

容器固定只能约束布局；viewport 变化还会触发浏览器绘制/栅格化与合成。根据现象，后两者是后续重点，尚不是已证实根因。品牌父链上的 backdrop-filter 和分数坐标仍为待对照因素；不把它们直接定为故障，不添加 translateZ/font-smoothing 等补丁。本次没有继续改动运行时 CSS，也没有把受控测量视为已复现用户的原生窗口异常。
