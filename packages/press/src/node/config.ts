import { validateCodeOptions } from "./code"
import { createJiti } from "jiti"
import { createHash } from "node:crypto"
import { existsSync, readFileSync } from "node:fs"
import { resolve, sep } from "node:path"
import type {
  ProjectConfiguration,
  ProjectOptions,
  YuPressConfig,
  ConfigEnvironment,
} from "./types"

function object(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value)
}
function factory(
  value: unknown,
): value is (environment: ConfigEnvironment) => unknown {
  return typeof value === "function"
}
function configuration(value: unknown): value is YuPressConfig {
  if (!object(value)) return false
  if (value.theme !== undefined && typeof value.theme !== "string") return false
  if (value.document !== undefined && typeof value.document !== "string")
    return false
  if (value.outputDir !== undefined && typeof value.outputDir !== "string")
    return false
  if (value.site !== undefined && !object(value.site)) return false
  if (
    value.vite !== undefined &&
    typeof value.vite !== "function" &&
    !object(value.vite)
  )
    return false
  if (value.content !== undefined) {
    if (!object(value.content)) return false
    const content = value.content
    if (content.srcDir !== undefined && typeof content.srcDir !== "string")
      return false
    for (const field of ["include", "exclude"])
      if (
        content[field] !== undefined &&
        (!Array.isArray(content[field]) ||
          !content[field].every((item) => typeof item === "string"))
      )
        return false
    if (content.publish !== undefined && typeof content.publish !== "function")
      return false
    if (
      content.metadataType !== undefined &&
      (!object(content.metadataType) ||
        typeof content.metadataType.from !== "string" ||
        typeof content.metadataType.name !== "string")
    )
      return false
  }
  if (
    value.plugins !== undefined &&
    (!Array.isArray(value.plugins) ||
      !value.plugins.every(
        (plugin) =>
          object(plugin) &&
          typeof plugin.name === "string" &&
          typeof plugin.setup === "function" &&
          (plugin.buildEnd === undefined ||
            typeof plugin.buildEnd === "function"),
      ))
  )
    return false
  return true
}
export async function loadYuPressConfig(options: ProjectOptions) {
  const root = resolve(options.root)
  const defaults = ["yupress.config.ts", "yupress.config.mts"]
    .map((path) => resolve(root, path))
    .filter(existsSync)
  if (!options.configFile && defaults.length > 1)
    throw new Error("Ambiguous YuPress configuration")
  const configFile = options.configFile
    ? resolve(root, options.configFile)
    : defaults[0]
  if (
    options.configFile !== undefined &&
    !existsSync(resolve(root, options.configFile))
  )
    throw new Error(
      `Missing documentation config: ${resolve(root, options.configFile)}`,
    )
  const configInputs = new Map<string, string>()
  if (configFile) {
    options.onDependency?.(configFile)
    configInputs.set(
      configFile,
      createHash("sha256").update(readFileSync(configFile)).digest("hex"),
    )
  }
  const transforms = createJiti(import.meta.url, {
    moduleCache: false,
    fsCache: false,
  })
  const loader = createJiti(import.meta.url, {
    moduleCache: false,
    fsCache: false,
    transform(input) {
      if (
        input.filename &&
        !input.filename.includes(`${sep}node_modules${sep}`)
      ) {
        options.onDependency?.(input.filename)
        configInputs.set(
          input.filename,
          createHash("sha256").update(input.source).digest("hex"),
        )
      }
      return { code: transforms.transform(input) }
    },
  })
  if (!configFile)
    throw new Error(
      `Missing YuPress configuration: ${resolve(root, "yupress.config.ts")}`,
    )
  const exported: unknown = await loader.import(configFile, { default: true })
  const value: unknown = factory(exported)
    ? await exported({ root, command: options.command ?? "generate" })
    : exported
  if (!configuration(value))
    throw new Error(`${configFile}: Expected YuPress configuration`)
  validateCodeOptions(value.code)
  const raw = value
  for (const key of [
    "prepare",
    "documentRenderer",
    "clientExtension",
    "viteExtension",
  ]) {
    if (key in raw)
      throw new Error(
        `${configFile}: ${key} was replaced by YuPress plugins, theme and vite options`,
      )
  }
  const { content, ...siteConfig } = raw
  const config: ProjectConfiguration = { ...siteConfig, ...content }
  for (const key of ["srcDir", "include", "exclude", "metadataType", "publish"])
    if (key in raw)
      throw new Error(`${configFile}: ${key} belongs under content`)
  const names = new Set<string>()
  for (const plugin of config.plugins ?? []) {
    if (!plugin.name || names.has(plugin.name))
      throw new Error(`Invalid or duplicate YuPress plugin: ${plugin.name}`)
    names.add(plugin.name)
  }
  return { root, configFile, config, configInputs }
}
