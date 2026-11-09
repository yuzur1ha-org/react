import { resolve } from "node:path"
import {
  configInputsChanged,
  loadYuPressConfig,
  type LoadedConfig,
} from "./config"
import { emit } from "./emit"
import { analyzeConfiguredProject } from "./project"
import type { ProjectOptions } from "./types"
import { withGenerationLock, writeGenerated } from "./write"

export async function generate(options: ProjectOptions, check = false) {
  options = {
    ...options,
    command: options.command ?? (check ? "check" : "generate"),
  }
  return generateConfigured(options, await loadYuPressConfig(options), check)
}

export async function generateConfigured(
  options: ProjectOptions,
  configuration: LoadedConfig,
  check = false,
) {
  const outputDir = resolve(
    configuration.root,
    configuration.config.outputDir ?? ".cache/press",
  )
  const run = async (current: LoadedConfig) => {
    if (
      resolve(current.root, current.config.outputDir ?? ".cache/press") !==
      outputDir
    )
      throw new Error(
        "Configuration output changed while acquiring generation lock; retry generation",
      )
    const snapshot = await analyzeConfiguredProject(options, current)
    await writeGenerated(outputDir, emit(snapshot), check)
    return snapshot
  }
  if (check) return run(configuration)
  return withGenerationLock(outputDir, async (waited) =>
    run(
      waited || configInputsChanged(options, configuration)
        ? await loadYuPressConfig(options)
        : configuration,
    ),
  )
}
