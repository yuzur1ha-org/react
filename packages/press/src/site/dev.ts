import { fileURLToPath } from "node:url"
import { writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { createServer, searchForWorkspaceRoot, type Plugin } from "vite"
import { watchProject } from "../node/watch"
import type { ProjectOptions, ProjectSnapshot } from "../node/types"

import { inside } from "../node/project"
import { waitForRouteManifest } from "./route-readiness"
import { prepareSite } from "./generate"
import { literal } from "./shared"
export async function devSite(options: ProjectOptions & { port?: number }) {
  let accept: (snapshot: ProjectSnapshot) => void = () => undefined
  let reject: (error: unknown) => void = () => undefined
  const initial = new Promise<ProjectSnapshot>((resolve, fail) => {
    accept = resolve
    reject = fail
  })
  let server: Awaited<ReturnType<typeof createServer>> | undefined
  let snapshot: ProjectSnapshot | undefined
  let failure: unknown
  let updates = Promise.resolve()
  let revision = 0
  const close = watchProject({ ...options, command: "dev" }, (next, error) => {
    const current = ++revision
    if (error || !next) {
      failure = error ?? new Error("Missing snapshot")
      reject(failure)
      server?.config.logger.error(
        failure instanceof Error
          ? failure.message
          : "Content generation failed",
      )
      const message =
        failure instanceof Error ? failure.message : "Content generation failed"
      const failedSnapshot = snapshot
      updates = updates
        .then(async () => {
          if (current !== revision) return
          if (failedSnapshot)
            await writeFile(
              join(failedSnapshot.outputDir, "site/compiled.json"),
              literal({ error: message }),
            )
          server?.ws.send({
            type: "error",
            err: {
              message,
              stack: "",
            },
          })
        })
        .catch((error) => server?.config.logger.error(String(error)))
      return
    }
    if (!server) {
      snapshot = next
      accept(next)
      return
    }
    const activeServer = server
    const directory = join(next.outputDir, "site")
    if (snapshot && snapshot.outputDir !== next.outputDir) {
      failure = new Error(
        "The generation directory changed; restart yupress dev",
      )
      activeServer.ws.send({
        type: "error",
        err: {
          message: "The generation directory changed; restart yupress dev",
          stack: "",
        },
      })
      return
    }
    snapshot = next
    updates = updates
      .then(async () => {
        if (current !== revision) return
        await prepareSite(
          next,
          directory,
          join(next.outputDir, "dev-build"),
          true,
        )
        if (snapshot !== next) return
        failure = undefined
        for (const environment of Object.values(activeServer.environments)) {
          const graph = environment.moduleGraph
          for (const module of graph.idToModuleMap.values())
            if (
              module.id?.split("?")[0]?.endsWith(".md") ||
              (module.file && inside(join(directory, "app"), module.file))
            )
              graph.invalidateModule(module)
        }
        await waitForRouteManifest(activeServer, directory)
        if (snapshot !== next) return
        activeServer.ws.send({ type: "full-reload" })
      })
      .catch((error) => {
        failure = error
        activeServer.config.logger.error(
          error instanceof Error ? error.message : "Content update failed",
        )
      })
  })
  const attachShutdown = () => {
    if (!server) return
    const shutdown = server.close.bind(server)
    server.close = async () => {
      await close()
      await updates
      await shutdown()
    }
  }
  try {
    const value = await initial
    const directory = join(value.outputDir, "site")
    await prepareSite(
      value,
      directory,
      join(value.outputDir, "dev-build"),
      true,
    )
    const lifecycle: Plugin = {
      name: "yupress:site-lifecycle",
      enforce: "pre",
      hotUpdate: {
        order: "post",
        handler() {
          return []
        },
      },
      configureServer(active) {
        active.middlewares.use((request, _response, next) => {
          if (!request.headers.accept?.includes("text/html")) return next()
          void updates.then(() => next(), next)
        })
        active.ws.on("connection", (client) => {
          if (failure)
            client.send(
              JSON.stringify({
                type: "error",
                err: {
                  message:
                    failure instanceof Error
                      ? failure.message
                      : "Content generation failed",
                  stack: "",
                },
              }),
            )
        })
      },
      transform(_code, id) {
        if (id.endsWith(".md") && failure)
          throw failure instanceof Error
            ? failure
            : new Error("Content generation failed")
      },
    }
    server = await createServer({
      root: directory,
      configFile: join(directory, "vite.config.ts"),
      plugins: [lifecycle],
      server: {
        host: "127.0.0.1",
        port: options.port ?? 5173,
        strictPort: true,
        hotUpdateEnvironments: async () => {},
        fs: {
          allow: [
            searchForWorkspaceRoot(value.root),
            searchForWorkspaceRoot(
              dirname(
                fileURLToPath(import.meta.resolve("@yuzur1ha/press/react")),
              ),
            ),
          ],
        },
      },
    })
    attachShutdown()
    await server.listen()
    server.printUrls()
    return server
  } catch (error) {
    await close()
    throw error
  }
}
