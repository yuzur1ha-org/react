import { readFile, realpath, stat } from "node:fs/promises"
import { createServer as createHttpServer } from "node:http"
import { extname, join, resolve } from "node:path"
import { type ProjectOptions } from "../node/types"

import { outputMarker, readOutputBase, safeInside } from "./shared"
export async function previewSite(
  options: ProjectOptions & { port?: number; outDir?: string },
) {
  const output = await realpath(resolve(options.root, options.outDir ?? "dist"))
  const outputFile = async (path: string) => {
    const target = await realpath(path)
    if (!safeInside(output, target)) throw new Error("Outside output")
    return target
  }
  const base = await readOutputBase(
    await outputFile(join(output, outputMarker)),
  )
  const types: Record<string, string> = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript",
    ".css": "text/css",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".data": "text/x-script",
  }
  const missing = await readFile(
    await outputFile(join(output, "404/index.html")),
  )
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
        const target = await outputFile(path)
        response.setHeader(
          "Content-Type",
          types[extname(path)] ?? "application/octet-stream",
        )
        response.end(await readFile(target))
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
