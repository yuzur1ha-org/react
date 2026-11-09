import { visit } from "@yuzur1ha/markdown/plugins"
import { deploymentHref } from "../content/routes"
import { createCodeService } from "./code"
import { loadYuPressConfig, type LoadedConfig } from "./config"
import { createHash } from "node:crypto"
import { globSync, readFileSync, readdirSync } from "node:fs"
import {
  basename,
  dirname,
  isAbsolute,
  relative,
  resolve,
  sep,
} from "node:path"
import { assertSerializableMetadata } from "./serialization"
import { defaultContent } from "./site"
import { validateDocuments, validateSections } from "../content/index"
import type { ProjectContext, ProjectOptions, ProjectSnapshot } from "./types"

export const slash = (path: string) => path.split(sep).join("/")
export function inside(directory: string, path: string) {
  const segment = relative(directory, path)
  return (
    segment === "" ||
    (!segment.startsWith(`..${sep}`) &&
      segment !== ".." &&
      !isAbsolute(segment))
  )
}
export async function discover(options: ProjectOptions) {
  return discoverSources(options, await loadYuPressConfig(options))
}

function discoverSources(options: ProjectOptions, configuration: LoadedConfig) {
  const { root, configFile, config, configInputs } = configuration
  const srcDir = resolve(root, config.srcDir ?? "content")
  options.onDependency?.(srcDir, true)
  const outputDir = resolve(root, config.outputDir ?? ".cache/press")
  const excluded = [
    "**/node_modules/**",
    "**/dist/**",
    "**/.cache/**",
    "**/tests/**",
    "**/.pipeline-*/**",
    ...(config.exclude ?? []),
  ]
  const sources = [
    ...new Set(
      (config.include ?? ["**/*.md"]).flatMap((pattern) =>
        globSync(pattern, { cwd: srcDir, exclude: excluded }),
      ),
    ),
  ]
    .map((path) => resolve(srcDir, path))
    .filter((path) => !inside(outputDir, path))
    .sort()
  return {
    root,
    configFile,
    config,
    outputDir,
    sources,
    configInputs,
  }
}

export async function analyzeProject(
  options: ProjectOptions,
): Promise<ProjectSnapshot> {
  return analyzeConfiguredProject(options, await loadYuPressConfig(options))
}

export async function analyzeConfiguredProject(
  options: ProjectOptions,
  configuration: LoadedConfig,
): Promise<ProjectSnapshot> {
  const discovery = discoverSources(options, configuration)
  const { root, configFile, config, outputDir, sources } = discovery
  const dependencies = new Set<string>([
    configFile,
    ...sources,
    ...discovery.configInputs.keys(),
  ])
  const inputs = new Map<string, string>(discovery.configInputs)
  const resolveConfig = (path: string) => resolve(dirname(configFile), path)
  const readBytes = (path: string) => {
    const full = resolveConfig(path)
    dependencies.add(full)
    options.onDependency?.(full)
    if (!readdirSync(dirname(full)).includes(basename(full)))
      throw new Error(`Missing or case-mismatched documentation path: ${full}`)
    const source = readFileSync(full)
    inputs.set(full, createHash("sha256").update(source).digest("hex"))
    return source
  }
  const read = (path: string) => readBytes(path).toString("utf8")
  const code = createCodeService(config.code)
  const context: ProjectContext = {
    compileDocument(source, path, compiler) {
      return code.compileDocument(source, path, {
        ...compiler,
        async analyze(tree, context) {
          const metadata = await compiler.analyze(tree, context)
          const base = config.site?.base ?? "/"
          if (base !== "/")
            visit(tree, "element", (element) => {
              for (const key of ["href", "src"] as const) {
                const value = element.properties[key]
                if (
                  typeof value === "string" &&
                  value.startsWith("/") &&
                  !value.startsWith("//") &&
                  !value.startsWith(base)
                )
                  element.properties[key] = deploymentHref(base, value)
              }
            })
          return metadata
        },
      })
    },
    highlightCode: code.highlightCode,
    root,
    configDir: dirname(configFile),
    sourceDir: resolve(root, config.srcDir ?? "content"),
    sources,
    resolve: resolveConfig,
    read,
    readBytes,
    json: (path) => JSON.parse(read(path)) as unknown,
    files: (pattern) =>
      globSync(pattern, { cwd: dirname(configFile) }).map(resolveConfig),
    dependencies,
  }
  const hooks: import("./types").YuPressPluginHooks[] = []
  let failure: unknown
  let failed = false
  let snapshot: ProjectSnapshot | undefined
  const errors: unknown[] = []
  try {
    for (const plugin of config.plugins ?? [])
      hooks.push(await plugin.setup(context))
    const fallback = config.site
      ? await defaultContent(config.site, config.srcDir).setup(context)
      : undefined
    const documents = []
    for (const path of sources) {
      const source = slash(relative(root, path))
      const matches = hooks.flatMap((hook, index) =>
        hook.content?.test(source)
          ? [{ compiler: hook.content, name: config.plugins?.[index]?.name }]
          : [],
      )
      if (matches.length > 1)
        throw new Error(
          `Multiple YuPress content plugins match ${source}: ${matches.map((match) => match.name).join(", ")}`,
        )
      const compiler = matches[0]?.compiler ?? fallback?.content
      if (!compiler)
        throw new Error(`No YuPress content compiler matches ${source}`)
      let document = await compiler.compile(read(path), source)
      for (const hook of hooks)
        document = (await hook.transformDocument?.(document)) ?? document
      document.compiled.dependencies = document.compiled.dependencies.map(
        (dependency) => resolve(root, dirname(source), dependency),
      )
      for (const dependency of document.compiled.dependencies) {
        dependencies.add(dependency)
        options.onDependency?.(dependency)
      }
      assertSerializableMetadata(document.metadata, document.key)
      if (document.source !== source)
        throw new Error(`Source identity mismatch: ${source}`)
      documents.push(document)
    }
    documents.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0))
    validateDocuments(documents)
    for (const hook of hooks) await hook.validate?.(documents)
    const published = config.publish
      ? documents.filter(config.publish)
      : documents
    if (config.site) validateSections(config.site.sections ?? [], published)
    snapshot = {
      root,
      configFile,
      outputDir,
      config,
      documents: published,
      dependencies,
      inputs,
    }
  } catch (error) {
    failed = true
    failure = error
  } finally {
    for (const hook of [...hooks].reverse()) {
      try {
        await hook.dispose?.()
      } catch (error) {
        errors.push(error)
      }
    }
    try {
      await code.dispose()
    } catch (error) {
      errors.push(error)
    }
  }
  if (errors.length)
    throw new AggregateError(
      failed ? [failure, ...errors] : errors,
      "YuPress plugin cleanup failed",
    )
  if (failed) throw failure
  if (!snapshot)
    throw new Error("YuPress content analysis produced no snapshot")
  return snapshot
}
