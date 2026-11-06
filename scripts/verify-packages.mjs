import { run } from "./run-tool.mjs"
import console from "node:console"
import { verifyIsolation, verifyTreeShaking } from "./verify-isolation.mjs"
import assert from "node:assert/strict"
import { mkdir, mkdtemp, readFile, writeFile, rename } from "node:fs/promises"
import { join, resolve } from "node:path"
import { tmpdir } from "node:os"
import process from "node:process"

const repository = resolve(import.meta.dirname, "..")
const { packageManager } = JSON.parse(
  await readFile(join(repository, "package.json"), "utf8"),
)
const requested = process.argv[2] === "--" ? process.argv[3] : process.argv[2]
const root = requested ?? (await mkdtemp(join(tmpdir(), "press-package-")))
if (requested) await mkdir(root)
console.info(`Isolated consumer: ${root}`)
const packages = [
  "token",
  "ui",
  "markdown",
  "press",
  "press-theme",
  "press-reference",
]
const local = {}
for (const name of packages) {
  await run("pnpm", ["pack", "--pack-destination", root], {
    cwd: join(repository, "packages", name),
    maxBuffer: 4_000_000,
  })
  const manifest = JSON.parse(
    await readFile(join(repository, "packages", name, "package.json"), "utf8"),
  )
  local[manifest.name] =
    `file:${join(root, `${manifest.name.replace("@", "").replaceAll("/", "-")}-${manifest.version}.tgz`)}`
  const archive = local[manifest.name].slice(5)
  const listing = (await run("tar", ["-tf", archive])).stdout.trim().split("\n")
  assert.ok(
    listing.every((file) =>
      /^package\/(dist\/|bin\/|README|GUIDE|LICENSE|THIRD_PARTY_NOTICES|fonts.css|package.json)/.test(
        file,
      ),
    ),
    `Unexpected packed file in ${name}`,
  )
  const published = JSON.parse(
    (await run("tar", ["-xOf", archive, "package/package.json"])).stdout,
  )
  assert.ok(
    Object.values({
      ...published.dependencies,
      ...published.peerDependencies,
    }).every((value) => !value.startsWith("workspace:")),
  )
  for (const file of listing.filter((file) =>
    /\.(?:js|mjs|ts|map)$/.test(file),
  )) {
    const content = (
      await run("tar", ["-xOf", archive, file], { maxBuffer: 8_000_000 })
    ).stdout
    assert.ok(
      !content.includes(repository) &&
        !content.includes(repository.replaceAll("\\", "/")) &&
        !content.includes("/Users/"),
      `Private path in ${name}/${file}`,
    )
  }
}
const consumer = join(root, "consumer")
await mkdir(join(consumer, "content"), { recursive: true })
await writeFile(
  join(consumer, "package.json"),
  JSON.stringify(
    {
      name: "press-dist-only-consumer",
      packageManager,
      private: true,
      type: "module",
      dependencies: {
        ...local,
        react: "19.3.1",
        "react-dom": "19.3.1",
        "react-router": "8.5.0",
        "@emotion/react": "11.14.0",
        vite: "8.3.5",
      },
      devDependencies: {
        typescript: "5.9.3",
        "@types/react": "19.3.0",
        "@types/react-dom": "19.3.0",
        "@types/node": "26.6.5",
      },
    },
    null,
    2,
  ),
)
await writeFile(
  join(consumer, "pnpm-workspace.yaml"),
  JSON.stringify({ packages: [], overrides: local }),
)
await writeFile(
  join(consumer, "yupress.config.ts"),
  `import { defineConfig } from '@yuzur1ha/press'
export default defineConfig({theme:"@yuzur1ha/press-theme",site:{title:'Dist-only manual',base:'/manual/',locales:[{id:'en',lang:'en',label:'English',sourceDir:'',prefix:''}]}})
`,
)
await writeFile(
  join(consumer, "content/index.md"),
  "# Standalone content\n\n[Read the guide](./guide.md)\n",
)
await writeFile(
  join(consumer, "content/guide.md"),
  "# Standalone guide\n\n" + "Large static body. ".repeat(1800) + "\n",
)
await run(
  "pnpm",
  ["install", "--ignore-scripts", "--strict-peer-dependencies"],
  { cwd: consumer, maxBuffer: 4_000_000 },
)
await writeFile(
  join(consumer, "contract.ts"),
  `import { markdownStyles } from '@yuzur1ha/token/markdown'
import * as token from '@yuzur1ha/token'
import * as ui from '@yuzur1ha/ui'
import * as markdown from '@yuzur1ha/markdown'
import * as markdownPlugins from '@yuzur1ha/markdown/plugins'
import * as pressVite from '@yuzur1ha/press/vite'
import * as pressSite from '@yuzur1ha/press/site'
import { DocumentScrollStyles } from '@yuzur1ha/ui/scroll-area'
import { defineConfig } from '@yuzur1ha/press'
import { generate } from '@yuzur1ha/press/node'
import { contentRoute, uniqueHeadingId } from '@yuzur1ha/press/content'
import { createMarkdownPlugin } from '@yuzur1ha/markdown/vite'
import { compileDocument, type CompilerOptions } from '@yuzur1ha/markdown/compiler'
import type { ComponentProps } from 'react'
import { SiteRoot, NotFound } from '@yuzur1ha/press-theme'
import { ReferenceDocument, type ComponentApi } from '@yuzur1ha/press-reference'
type RootProps = ComponentProps<typeof SiteRoot>
const config = defineConfig({theme:"@yuzur1ha/press-theme",site:{title:'Typed',locales:[{id:'en',lang:'en',label:'English',sourceDir:'',prefix:''}]}})
const api: ComponentApi = {component:"fixture",parts:[]}
const stylesheet: string = markdownStyles
void stylesheet; void DocumentScrollStyles
void api; void ReferenceDocument; void NotFound
const asyncConfig = defineConfig(async environment => ({...config,
 plugins:[{name:'consumer:typed',setup(context){return {validate(documents){void context.sources;void documents}}}}],
 vite: async ({command}) => ({define:{COMMAND:JSON.stringify(command),TASK:JSON.stringify(environment.command)}})
}))
void asyncConfig; void config; void generate; void contentRoute; void createMarkdownPlugin
void [token, ui, markdown, markdownPlugins, pressVite, pressSite]
const used = new Set<string>()
const heading: string = uniqueHeadingId('Heading', used)
void heading
const compiler: CompilerOptions<string> = {
 handlers: {paragraph(state, node) {return {type:'element',tagName:'p',properties:{},children:state.all(node)}}},
 analyze: () => 'metadata'
}
const nullable: CompilerOptions<string> = {...compiler, handlers:null}
const optional: CompilerOptions<string> = {...compiler, handlers:undefined}
void nullable; void optional; void compileDocument
const consume = (props: RootProps) => props.site.title
void consume
`,
)
await run(
  "pnpm",
  [
    "exec",
    "tsc",
    "--noEmit",
    "--strict",
    "--module",
    "nodenext",
    "--moduleResolution",
    "nodenext",
    "--target",
    "es2022",
    "contract.ts",
  ],
  { cwd: consumer, maxBuffer: 4_000_000 },
)
await run(
  "pnpm",
  [
    "exec",
    "tsc",
    "--noEmit",
    "--strict",
    "--module",
    "esnext",
    "--moduleResolution",
    "bundler",
    "--target",
    "es2022",
    "contract.ts",
  ],
  { cwd: consumer, maxBuffer: 4_000_000 },
)
await writeFile(
  join(consumer, "markdown-contract.ts"),
  `import { markdownStyles } from '@yuzur1ha/token/markdown'
import { DocumentScrollStyles } from '@yuzur1ha/ui/scroll-area'
import type { MenuProps, MenuItemProps } from '@yuzur1ha/ui/menu'
import {defineDocument} from '@yuzur1ha/press/react'
import {SiteRoot} from '@yuzur1ha/press-theme'
import {uniqueHeadingId} from '@yuzur1ha/press/content'
import type {ComponentProps} from 'react'
import {createElement, type ComponentType} from 'react'
const theme = defineDocument({Document:({Content}: {metadata:{title:string};Content:ComponentType})=>createElement(Content)})
void theme
const heading: string = uniqueHeadingId('Heading', new Set<string>())
const siteTitle = (props: ComponentProps<typeof SiteRoot>): string => props.site.title
void heading; void siteTitle
const menu: MenuProps = {label: 'Outline', activeAppearance: 'emphasis'}
const item: MenuItemProps = {href: '#section', activeAppearance: 'emphasis', active: true, 'aria-current': 'location'}
void menu; void item
const css: string = markdownStyles
void css; void DocumentScrollStyles
`,
)
await run(
  "pnpm",
  [
    "exec",
    "tsc",
    "--noEmit",
    "--strict",
    "--module",
    "nodenext",
    "--moduleResolution",
    "nodenext",
    "--target",
    "es2022",
    "markdown-contract.ts",
  ],
  { cwd: consumer, maxBuffer: 4_000_000 },
)
await writeFile(
  join(consumer, "markdown.mjs"),
  `import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { markdownStyles } from '@yuzur1ha/token/markdown'
const css = await readFile(new URL(import.meta.resolve('@yuzur1ha/token/markdown.css')), 'utf8')
assert.equal(css, markdownStyles)
`,
)
await run(process.execPath, ["markdown.mjs"], {
  cwd: consumer,
  maxBuffer: 4_000_000,
})
await writeFile(
  join(consumer, "shim-contract.ts"),
  `/// <reference types="@yuzur1ha/markdown/client" />
import {createElement, type ComponentProps} from 'react'
import Content from './sample.md'
const props: ComponentProps<typeof Content> = {components:{p:({children})=>createElement('p',{},children)}}
createElement(Content, props)
`,
)
await writeFile(join(consumer, "sample.md"), "# Client shim\n")
for (const [module, resolution] of [
  ["nodenext", "nodenext"],
  ["esnext", "bundler"],
])
  await run(
    "pnpm",
    [
      "exec",
      "tsc",
      "--noEmit",
      "--strict",
      "--module",
      module,
      "--moduleResolution",
      resolution,
      "--target",
      "es2022",
      "shim-contract.ts",
    ],
    { cwd: consumer, maxBuffer: 4_000_000 },
  )
const publicEntries = []
for (const name of packages) {
  const manifest = JSON.parse(
    await readFile(join(repository, "packages", name, "package.json"), "utf8"),
  )
  for (const [key, target] of Object.entries(manifest.exports)) {
    const specifier = manifest.name + (key === "." ? "" : key.slice(1))
    publicEntries.push({
      specifier,
      runtime: typeof target === "object" && !!target.import,
      css: typeof target === "string",
    })
  }
}
await writeFile(
  join(consumer, "entries.mjs"),
  `import assert from 'node:assert/strict'; import {access} from 'node:fs/promises'; for(const entry of ${JSON.stringify(publicEntries)}) {if(entry.runtime) await import(entry.specifier); if(entry.css) await access(new URL(import.meta.resolve(entry.specifier)));} console.log('All public entries resolve')`,
)
await run(process.execPath, ["entries.mjs"], {
  cwd: consumer,
  maxBuffer: 4_000_000,
})
const isolation = await verifyIsolation(root, local)
const treeShaking = await verifyTreeShaking(consumer)
const result = await run("pnpm", ["exec", "yupress", "build"], {
  cwd: consumer,
  maxBuffer: 8_000_000,
})
await writeFile(join(root, "build.log"), result.stdout + result.stderr)
const html = await readFile(join(consumer, "dist/guide/index.html"), "utf8")
assert.ok(
  html.includes("Standalone guide") && html.includes("Large static body."),
)
assert.ok(!/<!--\$[?!]-->|<div hidden id="S:/.test(html))
assert.ok(html.includes("/manual/assets/"))
await rename(join(consumer, "content"), join(consumer, "content-unavailable"))
await rename(
  join(consumer, "yupress.config.ts"),
  join(consumer, "press-unavailable.ts"),
)
await writeFile(
  join(consumer, "preview.mjs"),
  `import assert from 'node:assert/strict'
import { previewSite } from '@yuzur1ha/press/site'
const server = await previewSite({root:process.cwd(),port:0})
try {
 const origin = 'http://127.0.0.1:' + server.address().port
 const response = await fetch(origin + '/manual/guide/')
 assert.equal(response.status,200)
 assert.ok((await response.text()).includes('Standalone guide'))
 const missing = await fetch(origin + '/manual/absent/')
 assert.equal(missing.status,404)
 const missingHtml = await missing.text()
 assert.ok(missingHtml.includes('class="press-not-found'))
 assert.ok(missingHtml.includes('Page not found') && missingHtml.includes('Return home'))
 assert.ok(!missingHtml.includes('id="press-sidebar"'))
} finally {await new Promise(resolve=>server.close(resolve))}
`,
)
await run(process.execPath, ["preview.mjs"], {
  cwd: consumer,
  maxBuffer: 4_000_000,
})
console.info(
  JSON.stringify({
    root,
    isolation,
    treeShaking,
    packed: packages,
    declarations: true,
    markdownExports: true,
    strictMarkdownDeclarations: true,
    cliBuild: true,
    largeStaticBody: true,
    previewWithoutSources: true,
  }),
)
