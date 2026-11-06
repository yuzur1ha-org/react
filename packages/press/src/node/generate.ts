import { resolve } from "node:path"
import { loadYuPressConfig } from "./config"
import { emit } from "./emit"
import { analyzeProject } from "./project"
import type { ProjectOptions } from "./types"
import { withGenerationLock, writeGenerated } from "./write"

export async function generate(options: ProjectOptions, check = false) {
  options = {
    ...options,
    command: options.command ?? (check ? "check" : "generate"),
  }
  const run = async () => {
    const snapshot = await analyzeProject(options)
    await writeGenerated(snapshot.outputDir, emit(snapshot), check)
    return snapshot
  }
  if (check) return run()
  const configuration = await loadYuPressConfig(options)
  const outputDir = resolve(
    configuration.root,
    configuration.config.outputDir ?? ".cache/press",
  )
  return withGenerationLock(outputDir, async () => {
    const snapshot = await analyzeProject(options)
    if (snapshot.outputDir !== outputDir)
      throw new Error(
        "Configuration output changed while acquiring generation lock; retry generation",
      )
    await writeGenerated(snapshot.outputDir, emit(snapshot))
    return snapshot
  })
}
