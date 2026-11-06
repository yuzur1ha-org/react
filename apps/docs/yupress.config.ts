import { createHash } from "node:crypto"
import { globSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { defineConfig } from "@yuzur1ha/press"
import type { SiteOptions, SiteSection } from "@yuzur1ha/press/content"
import tailwindcss from "@tailwindcss/vite"
import { referenceContent, guideContent } from "./scripts/content/project"

// Invalidate prebundles when local library output changes without a lockfile change.
const workspaceRoot = resolve(import.meta.dirname, "../..")
const libraryHash = createHash("sha256")
for (const path of globSync("packages/*/dist/**/*.js", {
  cwd: workspaceRoot,
}).sort())
  libraryHash.update(readFileSync(resolve(workspaceRoot, path)))
const cacheDir = resolve(
  import.meta.dirname,
  ".cache/vite",
  libraryHash.digest("hex").slice(0, 16),
)

const uiGroups = [
  { id: "overview", label: "", documents: ["foundations"] },
  {
    id: "inputs",
    label: "Inputs",
    documents: [
      "input",
      "text-field",
      "number-field",
      "textarea",
      "select",
      "switch",
      "checkbox",
      "radio",
      "segmented",
      "input-otp",
      "form",
    ],
  },
  {
    id: "actions",
    label: "Actions & feedback",
    documents: [
      "button",
      "link",
      "tooltip",
      "popover",
      "toast",
      "modal",
      "drawer",
      "meter",
      "badge",
    ],
  },
  {
    id: "structure",
    label: "Structure",
    documents: [
      "menu",
      "disclosure",
      "accordion",
      "avatar",
      "setting-row",
      "scroll-area",
    ],
  },
]
export const sections: SiteSection[] = [
  {
    id: "ui",
    label: "UI",
    documents: uiGroups.flatMap((group) => group.documents),
    groups: uiGroups,
  },
  {
    id: "markdown",
    label: "Markdown",
    documents: [
      "markdown",
      "markdown/getting-started",
      "markdown/compiler",
      "markdown/plugins",
      "markdown/vite",
      "markdown/typography",
    ],
  },
  {
    id: "press",
    label: "YuPress",
    documents: [
      "press",
      "press/getting-started",
      "press/configuration",
      "press/content",
      "press/theme",
      "press/code-blocks",
      "press/deployment",
    ],
  },
]

const home = {
  content: "home",
  hero: {
    name: "Yuzur1ha / Documentation",
    text: "Considered by design.",
    tagline:
      "A shared visual language. Practical components. Documentation built to last.",
    actions: [
      {
        text: "Explore foundations",
        link: "/ui/foundations/",
        appearance: "primary",
      },
      { text: "Meet YuPress", link: "/press/", appearance: "secondary" },
    ],
  },
  features: [
    {
      title: "Interface",
      description: "Tokens and components with a common point of view.",
      link: "/ui/button/",
    },
    {
      title: "Markdown",
      description: "Readable source. Static output. Room for your own ideas.",
      link: "/markdown/",
    },
    {
      title: "YuPress",
      description:
        "A small publishing framework for the work behind the interface.",
      link: "/press/",
    },
  ],
} satisfies NonNullable<SiteOptions["home"]>

export default defineConfig({
  content: {
    srcDir: "src/content",
    include: ["**/*.md"],
    metadataType: {
      from: "src/docs/document.types.ts",
      name: "DocumentMetadata",
    },
  },
  site: {
    base: process.env.YUPRESS_BASE ?? "/",
    title: "Yuzur1ha Open",
    logo: { from: "./src/assets/brand-y.svg", alt: "Yuzur1ha" },
    favicon: "./src/assets/favicon.svg",
    themeStorageKey: "yuzur1ha-lab-theme",
    locales: [
      {
        id: "en",
        lang: "en",
        label: "English",
        shortLabel: "EN",
        sourceDir: "",
        prefix: "",
      },
      {
        id: "zh-cn",
        lang: "zh-CN",
        label: "简体中文",
        shortLabel: "简",
        sourceDir: "zh-cn",
        prefix: "/zh-cn",
        messages: {
          menu: "文档目录",
          menuButton: "文档目录",
          close: "关闭",
          sections: "栏目",
          theme: "主题",
          language: "语言",
          previous: "上一篇",
          next: "下一篇",
          toc: "本页内容",
          loading: "正在加载文档",
          skip: "跳至正文",
          navigation: "导航",
          documentNavigation: "文档导航",
          home: "首页",
          overview: "概览",
          docs: "文档",
          missing: "这篇文档暂无中文版本，请选择其他中文文档。",
          notFound: "未找到页面",
          returnHome: "返回首页",
        },
        home: {
          content: "home",
          hero: {
            name: "Yuzur1ha / 文档",
            text: "中文翻译正在进行中。",
            tagline: "请先阅读英文文档，中文内容将逐步补充。",
            actions: [
              {
                text: "Markdown 英文指南",
                link: "/markdown/",
                appearance: "primary",
              },
              {
                text: "YuPress 英文指南",
                link: "/press/",
                appearance: "secondary",
              },
            ],
          },
          features: [],
        },
      },
    ],
    home,
    links: [
      {
        label: "GitHub",
        href: "https://github.com/yuzur1ha-org/react",
        icon: "github",
      },
    ],
    sections,
  },
  theme: "@yuzur1ha/press-theme",
  document: "src/docs/site-document.tsx",
  vite: ({ command }) => ({
    cacheDir,
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ["react", "react-dom", "@emotion/react", "@emotion/cache"],
    },
    ssr: {
      noExternal:
        command === "build"
          ? true
          : [
              "@yuzur1ha/press-theme",
              "@yuzur1ha/press-reference",
              "@yuzur1ha/ui",
              "@yuzur1ha/token",
              "@emotion/react",
              "@emotion/cache",
            ],
    },
    optimizeDeps: {
      entries: [
        resolve(import.meta.dirname, "src/**/*.tsx"),
        resolve(import.meta.dirname, ".cache/press/site/app/entry.client.tsx"),
      ],
      include: [
        "@heroui/react",
        "@yuzur1ha/press-theme",
        "@yuzur1ha/press-reference",
        "@yuzur1ha/ui",
        "lucide-react",
        "@emotion/react",
        "@emotion/react/jsx-runtime",
        "@emotion/react/jsx-dev-runtime",
        "@yuzur1ha/press/react",
        "@yuzur1ha/press/content",
        "@yuzur1ha/ui/code-panel",
        "@yuzur1ha/press-theme > @emotion/cache",
      ],
    },
  }),
  plugins: [referenceContent(), guideContent()],
})
