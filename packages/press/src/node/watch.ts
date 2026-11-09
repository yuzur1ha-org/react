import { createHash } from "node:crypto"
import {
  existsSync,
  readFileSync,
  statSync,
  watch,
  type FSWatcher,
} from "node:fs"
import { dirname, resolve } from "node:path"
import { loadYuPressConfig } from "./config"
import { generateConfigured } from "./generate"
import { inside } from "./project"
import type { ProjectOptions, ProjectSnapshot } from "./types"
export function watchProject(
  options: ProjectOptions,
  update: (snapshot?: ProjectSnapshot, error?: unknown) => void,
) {
  let fingerprints = new Map<string, string>()
  const fingerprint = (path: string) => {
    try {
      return createHash("sha256").update(readFileSync(path)).digest("hex")
    } catch {
      return "missing"
    }
  }
  const dirty = new Set<string>()
  let initialized = false
  let previousSignature = ""
  let failed = false
  let closed = false
  let work: Promise<void> | undefined
  let running = false
  let pending = false
  let outputDir = resolve(options.root, ".cache/press")
  let timer: ReturnType<typeof setTimeout> | undefined
  const watched = new Map<string, { watcher: FSWatcher; recursive: boolean }>()
  const trackedFiles = new Set<string>()
  const track = (path: string, directory = false) => {
    if (closed) return
    if (!directory) trackedFiles.add(path)
    if (inside(options.root, path)) return
    let target = directory && existsSync(path) ? path : dirname(path)
    while (!existsSync(target) && dirname(target) !== target)
      target = dirname(target)
    observe(target, directory)
  }
  const trackedOptions = {
    ...options,
    command: options.command ?? ("watch" as const),
    onDependency: track,
  }
  const run = async () => {
    if (running) {
      pending = true
      return
    }
    running = true
    do {
      pending = false
      if (
        initialized &&
        !failed &&
        dirty.size &&
        [...dirty].every((path) => fingerprints.get(path) === fingerprint(path))
      ) {
        dirty.clear()
        break
      }
      dirty.clear()
      trackedFiles.clear()
      try {
        const configuration = await loadYuPressConfig(trackedOptions)
        outputDir = resolve(
          configuration.root,
          configuration.config.outputDir ?? ".cache/press",
        )
        const snapshot = await generateConfigured(trackedOptions, configuration)
        outputDir = snapshot.outputDir
        fingerprints = new Map(snapshot.inputs)
        initialized = true
        const signature = createHash("sha256")
          .update(
            JSON.stringify(
              [...snapshot.inputs].sort(([a], [b]) =>
                a < b ? -1 : a > b ? 1 : 0,
              ),
            ),
          )
          .digest("hex")
        if (!closed && (failed || signature !== previousSignature))
          update(snapshot)
        previousSignature = signature
        failed = false
      } catch (error) {
        failed = true
        if (!closed) update(undefined, error)
      }
    } while (pending && !closed)
    running = false
  }
  const changed = (path: string) => {
    if (
      closed ||
      inside(outputDir, path) ||
      (path !== resolve(options.root) && inside(path, outputDir)) ||
      /(?:^|[/\\])(?:node_modules|dist|\.git|test-results)(?:[/\\]|$)/.test(
        path,
      )
    )
      return
    if (
      !trackedFiles.has(path) &&
      !fingerprints.has(path) &&
      !/\.(?:md|json|ts|mts|tsx|css|svg|png|webp|avif|gif|jpe?g)$/i.test(path)
    ) {
      try {
        if (!statSync(path).isDirectory()) return
      } catch {
        if (![...fingerprints.keys()].some((input) => inside(path, input)))
          return
      }
    }
    if (!failed && fingerprints.get(path) === fingerprint(path)) return
    dirty.add(path)
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (running) {
        pending = true
        return
      }
      work = run()
      void work
    }, 80)
  }
  function observe(directory: string, recursive: boolean) {
    for (const [path, entry] of watched) {
      if (entry.recursive && inside(path, directory)) return
      if (path === directory && !recursive) return
    }
    const watcher = watch(directory, { recursive }, (_event, file) => {
      if (file) changed(resolve(directory, file))
    })
    watcher.on("error", (error) => {
      if (!closed) update(undefined, error)
    })
    watched.get(directory)?.watcher.close()
    watched.set(directory, { watcher, recursive })
  }
  observe(resolve(options.root), true)
  work = run()
  return async () => {
    closed = true
    clearTimeout(timer)
    for (const { watcher } of watched.values()) watcher.close()
    await work
  }
}
