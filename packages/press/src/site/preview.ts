import { readFile, stat } from "node:fs/promises"
import { createServer as createHttpServer } from "node:http"
import { extname, join, resolve } from "node:path"
import { normalizeBase } from "../content/index"
import { type ProjectOptions } from "../node/types"

import { outputMarker, safeInside } from "./shared"
export async function previewSite(
  options: ProjectOptions & { port?: number; outDir?: string },
) {
  const output = resolve(options.root, options.outDir ?? "dist")
  const marker: unknown = JSON.parse(
    await readFile(join(output, outputMarker), "utf8"),
  )
  if (
    !marker ||
    typeof marker !== "object" ||
    !("version" in marker) ||
    marker.version !== 1 ||
    !("base" in marker) ||
    typeof marker.base !== "string"
  )
    throw new Error("Invalid Press static output marker; rebuild the site")
  const base = normalizeBase(marker.base)
  const types: Record<string, string> = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript",
    ".css": "text/css",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".data": "text/x-script",
  }
  const missing = await readFile(join(output, "404/index.html"))
  const server = createHttpServer((request, response) => {
    void (async () => {
      try {
        const pathname = new URL(request.url ?? "/", "http://localhost")
          .pathname
        if (!pathname.startsWith(base)) throw new Error("Outside base")
        let path = resolve(
          output,
          decodeURIComponent(pathname.slice(base.length)) || ".",
        )
        if (path !== output && !safeInside(output, path))
          throw new Error("Outside output")
        if ((await stat(path)).isDirectory()) path = join(path, "index.html")
        response.setHeader(
          "Content-Type",
          types[extname(path)] ?? "application/octet-stream",
        )
        response.end(await readFile(path))
      } catch {
        response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" })
        response.end(missing)
      }
    })()
  })
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject)
    server.listen(options.port ?? 5173, "127.0.0.1", resolve)
  })
  return server
}
