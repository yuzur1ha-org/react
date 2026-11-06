import { resolve } from "node:path"
import { normalizePath, type Plugin, type ResolvedConfig } from "vite"
import { generate } from "../node/generate"
import { watchProject } from "../node/watch"
import type { IndexedDocument, ProjectSnapshot } from "../node/types"

const registration = Symbol("documentation preset")
type Registration = {
  namespace: string
  ownsMarkdown: (id: string) => Promise<boolean>
}
type CorePlugin = Plugin & { [registration]?: Registration }

export type DocumentationOptions = {
  namespace: string
  configFile?: string
}

export function createCore(
  options: DocumentationOptions,
  sidebar: boolean,
  markdown: boolean,
) {
  let config: ResolvedConfig | undefined
  let released = false
  let snapshot: ProjectSnapshot | undefined
  let initial: Promise<ProjectSnapshot> | undefined
  let failure: unknown
  let dispose: (() => Promise<void>) | undefined
  let peers: Registration[] = []
  const documentIndexes = new WeakMap<
    ProjectSnapshot,
    Map<string, IndexedDocument>
  >()

  const projectOptions = () => ({
    root: context.root,
    ...(options.configFile !== undefined
      ? { configFile: options.configFile }
      : {}),
  })
  const validate = (value: ProjectSnapshot) => {
    if (sidebar && !value.config.site)
      throw new Error(
        `Missing site configuration for sidebar: ${resolve(context.root, "sidebar.json")}`,
      )
    return value
  }
  const context = {
    get root() {
      if (!config) throw new Error("Documentation preset is not configured")
      return config.root
    },
    async isManagedByPeer(id: string) {
      for (const peer of peers) if (await peer.ownsMarkdown(id)) return true
      return false
    },
    async findDocument(id: string) {
      const value = await context.ensure()
      let documents = documentIndexes.get(value)
      if (!documents) {
        documents = new Map(
          value.documents.map((document) => [
            normalizePath(resolve(value.root, document.source)),
            document,
          ]),
        )
        documentIndexes.set(value, documents)
      }
      return documents.get(normalizePath(id))
    },
    async ensure(): Promise<ProjectSnapshot> {
      if (failure)
        throw failure instanceof Error
          ? failure
          : new Error("Documentation generation failed")
      return (
        snapshot ??
        (initial ??= generate(projectOptions()).then((value) => {
          snapshot = validate(value)
          return snapshot
        }))
      )
    },
  }
  let closing: Promise<void> | undefined
  const close = () =>
    (closing ??= (async () => {
      const stop = dispose
      dispose = undefined
      peers = []
      initial = undefined
      snapshot = undefined
      failure = undefined
      await stop?.()
      released = true
    })())
  const core: CorePlugin = {
    name: `yuzur1ha:${options.namespace}:core`,
    enforce: "pre",
    [registration]: {
      namespace: options.namespace,
      async ownsMarkdown(id) {
        return markdown && (await context.findDocument(id)) !== undefined
      },
    },
    configResolved(value) {
      const registrations = value.plugins.flatMap((candidate: CorePlugin) => {
        const entry = candidate[registration]
        return entry ? [entry] : []
      })
      if (
        registrations.filter((entry) => entry.namespace === options.namespace)
          .length > 1
      )
        throw new Error(
          `Duplicate documentation namespace registration: ${options.namespace}`,
        )
      if (config && config !== value && !released)
        throw new Error(
          "Documentation preset is already configured; call docs.plugins() for each independent Vite configuration",
        )
      peers = registrations.filter(
        (entry) => entry.namespace !== options.namespace,
      )
      config = value
      closing = undefined
      released = false
    },
    async buildStart() {
      try {
        const value = await context.ensure()
        for (const path of value.dependencies) this.addWatchFile(path)
      } catch (error) {
        // Vite caches a rejected dev buildStart; module loads must report errors instead.
        if (config?.command !== "serve") throw error
      }
    },
    configureServer(server) {
      // watchProject owns the first dev generation; buildStart and loads await it.
      let ready: (value: ProjectSnapshot) => void
      let reject: (error: unknown) => void
      initial = new Promise<ProjectSnapshot>((resolve, fail) => {
        ready = resolve
        reject = fail
      })
      // An initial failure may arrive before Vite invokes buildStart.
      void initial.catch(() => {})
      let initialized = false
      const stop = watchProject(projectOptions(), (next, error) => {
        const refresh = initialized
        initialized = true
        if (refresh || error) server.moduleGraph.invalidateAll()
        try {
          if (error)
            throw error instanceof Error
              ? error
              : new Error("Documentation generation failed", { cause: error })
          if (!next)
            throw new Error("Documentation generation returned no snapshot")
          snapshot = validate(next)
          failure = undefined
          ready(snapshot)
          initial = undefined
          if (refresh) server.ws.send({ type: "full-reload" })
        } catch (error) {
          failure = error
          snapshot = undefined
          reject(error)
          const message =
            error instanceof Error
              ? error.message
              : "Documentation generation failed"
          server.config.logger.error(message)
          server.ws.send({
            type: "error",
            err: {
              message,
              stack: error instanceof Error ? (error.stack ?? "") : "",
            },
          })
        }
      })
      const closed = () => {
        void close()
      }
      dispose = async () => {
        server.httpServer?.off("close", closed)
        await stop()
      }
      server.httpServer?.once("close", closed)
    },
    watchChange() {
      if (config?.command === "build") {
        snapshot = undefined
        initial = undefined
        failure = undefined
      }
    },
    async closeBundle() {
      if (config?.command === "serve" || !this.meta.watchMode) await close()
    },
    closeWatcher: close,
  }
  return { core, context }
}
