import { createHash } from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { deploymentHref } from "../content/index"
import { type ProjectSnapshot } from "../node/types"
import { assetName, publicSite } from "../node/site"

import { writeCompiledSnapshot } from "./compiled"
import { literal } from "./shared"
export async function prepareSite(
  snapshot: ProjectSnapshot,
  directory: string,
  buildDirectory: string,
  development = false,
) {
  if (!snapshot.config.theme)
    throw new Error("Missing theme: set theme to a package or local module")
  const theme = snapshot.config.theme.startsWith(".")
    ? resolve(snapshot.root, snapshot.config.theme)
    : snapshot.config.theme
  const moduleId = (value: string) =>
    value.startsWith(".")
      ? resolve(snapshot.root, value).replaceAll("\\", "/")
      : value
  const site = publicSite(snapshot)
  await mkdir(join(directory, "app"), { recursive: true })
  const save = async (path: string, text: string) => {
    const target = join(directory, path)
    if ((await readFile(target, "utf8").catch(() => null)) !== text)
      await writeFile(target, text)
  }
  await writeCompiledSnapshot(
    directory,
    literal(
      snapshot.documents.map((document) => ({
        source: resolve(snapshot.root, document.source),
        code: document.compiled.code,
        map: document.compiled.map,
        dependencies: document.compiled.dependencies,
      })),
    ),
  )
  await save(
    "vite.config.ts",
    `import { resolveSiteVite } from ${literal(fileURLToPath(import.meta.resolve("@yuzur1ha/press/site")))}
export default environment => resolveSiteVite(${literal(directory)}, ${literal(site.base)}, {root:${literal(snapshot.root)},configFile:${literal(snapshot.configFile)}}, environment)
`,
  )
  await save(
    "react-router.config.ts",
    `export default { ssr: ${development}, buildDirectory: ${literal(buildDirectory)}, basename: ${literal(site.base)}, prerender: ${literal(development ? false : [...site.documents.map((document) => document.route), ...site.homes.map((home) => home.route), "/404/"])} }\n`,
  )
  await save(
    "app/root.tsx",
    `import * as themeModule from ${literal(theme)}
import { CodeBlockProvider, type ThemeModule } from '@yuzur1ha/press/react'
const { SiteRoot, DocumentFailure, CodeBlockView } = themeModule as ThemeModule
${snapshot.config.document ? `import ${literal(resolve(snapshot.root, snapshot.config.document))}` : ""}

${snapshot.config.site?.logo ? `import logo from ${literal(moduleId(snapshot.config.site.logo.from) + "?no-inline")}` : ""}
${snapshot.config.site?.favicon ? `import favicon from ${literal(moduleId(snapshot.config.site.favicon) + "?no-inline")}` : ""}
const site = { ...${literal(site)}, ${snapshot.config.site?.logo ? `logo:{src:logo,alt:${literal(snapshot.config.site.logo.alt)}},` : ""} ${snapshot.config.site?.favicon ? "favicon," : ""} }
export default function Root() { return <CodeBlockProvider view={CodeBlockView}><SiteRoot site={site}></SiteRoot></CodeBlockProvider> }
export function ErrorBoundary() { return <CodeBlockProvider view={CodeBlockView}><SiteRoot site={site} error={<DocumentFailure/>} /></CodeBlockProvider> }

`,
  )
  await save(
    "app/entry.client.tsx",
    `import { startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'
startTransition(() => { hydrateRoot(document, <HydratedRouter />) })
`,
  )
  await save(
    "app/entry.server.tsx",
    `import { prerender } from 'react-dom/static'
import { ServerRouter, type EntryContext } from 'react-router'
export default async function render(request: Request, status: number, headers: Headers, context: EntryContext) {
  const errors: unknown[] = []
  // Static output must inline completed boundaries regardless of their byte size.
  const { prelude, postponed } = await prerender(<ServerRouter context={context} url={request.url}/>, { progressiveChunkSize: Number.MAX_SAFE_INTEGER, onError(error) { errors.push(error) }, onBrowserBailout(error) { errors.push(error) } })
  if (postponed != null) throw new Error('Static rendering left postponed content')
  if (errors.length) throw errors[0]
  headers.set('Content-Type', 'text/html; charset=utf-8')
  return new Response(prelude, {status, headers})
}
`,
  )
  if (development) {
    const assets = join(directory, "public/_content")
    await mkdir(assets, { recursive: true })
    for (const path of snapshot.dependencies) {
      if (!/\.(?:svg|png|jpe?g|webp|avif|gif)$/i.test(path)) continue
      const bytes = await readFile(path)
      await writeFile(join(assets, assetName(path, bytes)), bytes)
    }
  }
  const routes = []
  for (const document of site.documents) {
    const index = createHash("sha256")
      .update(document.key)
      .digest("hex")
      .slice(0, 16)
    const full = snapshot.documents.find(
      (candidate) => candidate.key === document.key,
    )
    if (!full) throw new Error(`Missing source record: ${document.key}`)
    const renderer = snapshot.config.document
    await save(
      `app/document-${index}.tsx`,
      `import { lazy, Suspense } from 'react'
import { DocumentPage, DocumentBoundary, DocumentLoading } from ${literal(theme)}
${
  renderer
    ? `import theme from ${literal(resolve(snapshot.root, renderer))}
const Renderer = theme.Document`
    : ""
}
const document = ${literal(document)}
const Document = lazy(async () => {
  const {default:Content} = await import(${literal(resolve(snapshot.root, document.source))})
  return {default:()=> <DocumentPage document={document}>${renderer ? `<Renderer metadata={${literal(full.metadata)}} Content={Content}/>` : '<div className="press-prose yu-markdown" data-markdown="gfm"><h1>{document.metadata.title}</h1><Content/></div>'}</DocumentPage>}
})
export function meta() { return [{ title: document.metadata.title + ' — ' + ${literal(site.title)} }, { name: 'description', content: document.metadata.description ?? '' }, { tagName: 'link', rel: 'canonical', href: ${literal(deploymentHref(site.base, document.route))} }] }
export function loader() { return { documentKey: document.key } }
export default function Page() { return <DocumentBoundary><Suspense fallback={<DocumentLoading/>}><Document/></Suspense></DocumentBoundary> }

`,
    )
    routes.push(
      document.route === "/"
        ? `index('document-${index}.tsx')`
        : `route(${literal(document.route.slice(1))}, 'document-${index}.tsx')`,
    )
  }
  for (const home of site.homes) {
    const id = createHash("sha256")
      .update(home.route)
      .digest("hex")
      .slice(0, 16)
    await save(
      `app/home-${id}.tsx`,
      `import {lazy,Suspense} from 'react'
import {SiteHomePage,DocumentBoundary,DocumentLoading} from ${literal(theme)}
const home=${literal(home)}
${home.document ? `const Page=lazy(async()=>{const {default:Content}=await import(${literal(resolve(snapshot.root, home.document.source))});return {default:()=> <SiteHomePage home={home}><Content/></SiteHomePage>}})` : "const Page=()=> <SiteHomePage home={home}/>"}
export function meta(){return [{title:${literal(site.title)}},{name:'description',content:${literal(site.description)}},{tagName:'link',rel:'canonical',href:${literal(deploymentHref(site.base, home.route))}}]}
export default function Home(){return <DocumentBoundary><Suspense fallback={<DocumentLoading/>}><Page/></Suspense></DocumentBoundary>}
`,
    )
    routes.push(
      home.route === "/"
        ? `index('home-${id}.tsx')`
        : `route(${literal(home.route.slice(1))}, 'home-${id}.tsx')`,
    )
  }
  await save(
    "app/missing.tsx",
    `import {NotFound} from ${literal(theme)}
export default NotFound
`,
  )
  routes.push("route('*', 'missing.tsx')")
  await save(
    "app/routes.ts",
    `import { route, index } from ${literal(fileURLToPath(import.meta.resolve("@react-router/dev/routes")))}\nexport default [${routes.join(",\n")}]\n`,
  )
  return site
}
