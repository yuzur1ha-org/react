import type { CodeOptions, HighlightedCode } from "../content/code"
import type { CompilerOptions } from "@yuzur1ha/markdown/compiler"
import type { CompiledDocument } from "@yuzur1ha/markdown/compiler"
import type { ConfigEnv, UserConfig } from "vite"
import type { ContentDocument, SiteOptions } from "../content/index"
export type Awaitable<T> = T | Promise<T>
export type IndexedDocument = ContentDocument & {
  compiled: CompiledDocument<unknown>
}
export type ProjectContext = {
  compileDocument: <Metadata>(
    source: string,
    path: string,
    options: CompilerOptions<Metadata>,
  ) => Promise<CompiledDocument<Metadata>>
  highlightCode: (source: string, language?: string) => Promise<HighlightedCode>
  root: string
  configDir: string
  sourceDir: string
  sources: readonly string[]
  resolve: (path: string) => string
  read: (path: string) => string
  readBytes: (path: string) => Uint8Array
  json: (path: string) => unknown
  files: (pattern: string) => string[]
  dependencies: Set<string>
}
export type ContentCompiler = {
  test: (path: string) => boolean
  compile: (source: string, path: string) => Awaitable<IndexedDocument>
}
export type YuPressPluginHooks = {
  content?: ContentCompiler
  transformDocument?: (
    document: IndexedDocument,
  ) => Awaitable<IndexedDocument | void>
  validate?: (documents: readonly IndexedDocument[]) => Awaitable<void>
  dispose?: () => Awaitable<void>
}
export type BuildResult = { output: string; documents: number }
export type YuPressPlugin = {
  name: string
  setup: (context: ProjectContext) => Awaitable<YuPressPluginHooks>
  buildEnd?: (result: BuildResult) => Awaitable<void>
}
export type ContentOptions = {
  srcDir?: string
  include?: string[]
  exclude?: string[]
  metadataType?: { from: string; name: string }
  publish?: (document: IndexedDocument) => boolean
}
export type ConfigEnvironment = {
  root: string
  command: "dev" | "build" | "generate" | "check" | "watch"
}
export type YuPressConfig = {
  code?: CodeOptions | false
  site?: SiteOptions
  content?: ContentOptions
  plugins?: YuPressPlugin[]
  theme?: string
  document?: string
  vite?: UserConfig | ((environment: ConfigEnv) => Awaitable<UserConfig>)
  outputDir?: string
}
export type YuPressConfigExport =
  YuPressConfig | ((environment: ConfigEnvironment) => Awaitable<YuPressConfig>)
export type ProjectConfiguration = Omit<YuPressConfig, "content"> &
  ContentOptions
export type ProjectOptions = {
  root: string
  configFile?: string
  command?: ConfigEnvironment["command"]
  onDependency?: (path: string, directory?: boolean) => void
}
export type ProjectSnapshot = {
  root: string
  configFile: string
  outputDir: string
  config: ProjectConfiguration
  documents: IndexedDocument[]
  dependencies: Set<string>
  inputs: Map<string, string>
}
export function defineConfig(configuration: YuPressConfig): YuPressConfig
export function defineConfig(
  configuration: (environment: ConfigEnvironment) => Awaitable<YuPressConfig>,
): typeof configuration
export function defineConfig(configuration: YuPressConfigExport) {
  return configuration
}
