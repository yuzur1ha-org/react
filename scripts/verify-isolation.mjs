import { run } from "./run-tool.mjs"
import assert from "node:assert/strict"
import { access, mkdir, readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"

export async function verifyIsolation(root, packages) {
  for (const name of ["token", "markdown"]) {
    const directory = join(root, `${name}-only`)
    await mkdir(directory)
    await writeFile(
      join(directory, "package.json"),
      JSON.stringify({
        private: true,
        type: "module",
        dependencies: { [`@yuzur1ha/${name}`]: packages[`@yuzur1ha/${name}`] },
      }),
    )
    await writeFile(
      join(directory, "pnpm-workspace.yaml"),
      JSON.stringify({ packages: [], overrides: packages }),
    )
    await run(
      "pnpm",
      ["install", "--ignore-scripts", "--strict-peer-dependencies"],
      { cwd: directory, maxBuffer: 4_000_000 },
    )
    for (const dependency of [
      "react",
      "vite",
      "@emotion/react",
      "@yuzur1ha/ui",
    ])
      await assert.rejects(access(join(directory, "node_modules", dependency)))
    const body =
      name === "token"
        ? `import {tokens,toCSSVariables} from '@yuzur1ha/token'; if(!Object.keys(toCSSVariables(tokens)).length) throw new Error('Missing tokens');`
        : `import {compileDocument} from '@yuzur1ha/markdown/compiler'; const output=await compileDocument('# Standalone','standalone.md',{analyze:()=>({})}); if(!output.code.includes('Standalone')) throw new Error('Missing compiler output');`
    await writeFile(join(directory, "verify.mjs"), body)
    await run(process.execPath, ["verify.mjs"], {
      cwd: directory,
      maxBuffer: 4_000_000,
    })
  }
  const cwd = join(root, "core-only")
  await mkdir(join(cwd, "content"), { recursive: true })
  await writeFile(
    join(cwd, "package.json"),
    JSON.stringify({
      private: true,
      type: "module",
      dependencies: {
        "@yuzur1ha/press": packages["@yuzur1ha/press"],
        react: "19.3.1",
        "react-dom": "19.3.1",
        "react-router": "8.5.0",
        vite: "8.3.5",
      },
    }),
  )
  await writeFile(
    join(cwd, "pnpm-workspace.yaml"),
    JSON.stringify({ packages: [], overrides: packages }),
  )
  await run(
    "pnpm",
    ["install", "--ignore-scripts", "--strict-peer-dependencies"],
    { cwd, maxBuffer: 4_000_000 },
  )
  for (const name of ["ui", "token", "press-theme", "press-reference"])
    await assert.rejects(access(join(cwd, "node_modules/@yuzur1ha", name)))
  await writeFile(
    join(cwd, "yupress.config.ts"),
    'import {defineConfig} from "@yuzur1ha/press"; export default defineConfig({theme:"./theme.tsx",site:{title:"Custom",locales:[{id:"en",lang:"en",label:"English",sourceDir:"",prefix:""}]}})',
  )
  await writeFile(
    join(cwd, "content/index.md"),
    "# Custom theme\n\nCore without default packages.\n\n```ts\nconst standalone = 1\n```\n",
  )
  await writeFile(
    join(cwd, "theme.tsx"),
    `import {createElement as h, Fragment} from 'react'
import {Meta, Links, Outlet, Scripts} from 'react-router'
import {SiteContext} from '@yuzur1ha/press/react'
export function SiteRoot({site,error}) {return h('html',{lang:'en'},h('head',{},h(Meta),h(Links)),h('body',{},h(SiteContext,{value:site},error ?? h(Outlet)),h(Scripts)))}
export function DocumentPage({children}){return h('main',{},children)}
export function SiteHomePage({children}){return h('main',{},children)}
export function DocumentBoundary({children}){return h(Fragment,{},children)}
export function DocumentFailure(){return h('main',{},'Failure')}
export function DocumentLoading(){return h('p',{role:'status'},'Loading')}
export function NotFound(){return h('main',{},h('h1',{},'Missing'))}
`,
  )
  for (const command of ["generate", "check", "build"])
    await run("pnpm", ["exec", "yupress", command], {
      cwd,
      maxBuffer: 8_000_000,
    })
  assert.match(
    await readFile(join(cwd, "dist/index.html"), "utf8"),
    /Core without default packages/,
  )
  assert.match(
    await readFile(join(cwd, "dist/index.html"), "utf8"),
    /press-code-fallback/,
  )
  await writeFile(
    join(cwd, "dev.mjs"),
    `import assert from 'node:assert/strict'; import {devSite} from '@yuzur1ha/press/site'; const server=await devSite({root:process.cwd(),port:5199}); try {const response=await fetch('http://127.0.0.1:5199/');assert.equal(response.status,200)} finally {await server.close()}`,
  )
  await run(process.execPath, ["dev.mjs"], {
    cwd,
    maxBuffer: 8_000_000,
    timeout: 60_000,
  })
  return {
    tokenWithoutReact: true,
    compilerWithoutReactOrVite: true,
    customTheme: true,
    defaultPackagesAbsent: true,
    generate: true,
    check: true,
    build: true,
    dev: true,
  }
}

export async function verifyTreeShaking(consumer) {
  await writeFile(
    join(consumer, "button.tsx"),
    'export { Button } from "@yuzur1ha/ui/button"',
  )
  await writeFile(
    join(consumer, "tree.mjs"),
    `import {build} from 'vite';import {writeFile} from 'node:fs/promises';const modules=[];const output=await build({configFile:false,logLevel:'error',plugins:[{name:'inspect',generateBundle(_options,bundle){for(const file of Object.values(bundle))if(file.type==='chunk')for(const [id,meta] of Object.entries(file.modules))if(meta.renderedLength>0)modules.push(id)}}],build:{write:false,minify:true,lib:{entry:'button.tsx',formats:['es']},rolldownOptions:{external:id=>/^(react|react-dom|@emotion\\/react)(\\/|$)/.test(id)}}});await writeFile('tree-result.json',JSON.stringify({modules,bytes:output[0].output.reduce((n,item)=>n+(item.type==='chunk'?item.code.length:0),0)}))`,
  )
  await run(process.execPath, ["tree.mjs"], {
    cwd: consumer,
    maxBuffer: 4_000_000,
  })
  const value = JSON.parse(
    await readFile(join(consumer, "tree-result.json"), "utf8"),
  )
  assert.ok(value.bytes > 0)
  assert.ok(
    value.modules.every(
      (id) =>
        !/(accordion|collapsible|press-reference|markdown\/dist\/compiler)/.test(
          id,
        ),
    ),
  )
  return { buttonBytes: value.bytes, moduleCount: value.modules.length }
}
