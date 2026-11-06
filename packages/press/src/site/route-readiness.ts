import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { setTimeout as delay } from "node:timers/promises"
import type { ViteDevServer } from "vite"

function routeModules(code: string) {
  return [...new Set(code.match(/(?:document|home)-[a-f0-9]{16}/g) ?? [])]
    .sort()
    .join(",")
}

export async function waitForRouteManifest(
  server: ViteDevServer,
  directory: string,
) {
  const expected = routeModules(
    await readFile(join(directory, "app/routes.ts"), "utf8"),
  )
  const deadline = Date.now() + 10000
  let lastError: unknown
  let actual = "unavailable"
  while (Date.now() < deadline) {
    try {
      const manifest = await server.environments.client.transformRequest(
        "virtual:react-router/browser-manifest",
      )
      if (manifest) {
        actual = routeModules(manifest.code)
        if (actual === expected) return
      }
    } catch (error) {
      lastError = error
    }
    await delay(25)
  }
  throw new Error(
    `YuPress route inventory did not converge: expected ${expected}; received ${actual}`,
    { cause: lastError },
  )
}
