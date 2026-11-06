import { spawn } from "node:child_process"
import { randomUUID } from "node:crypto"
import {
  cp,
  mkdir,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"
import { generate } from "../node/generate"
import type { ProjectOptions } from "../node/types"
import { assetName } from "../node/site"

import { prepareSite } from "./generate"
import { outputMarker, safeInside } from "./shared"
export async function buildSite(options: ProjectOptions & { outDir?: string }) {
  const snapshot = await generate({ ...options, command: "build" })
  const directory = join(snapshot.outputDir, "site")
  const staging = join(snapshot.outputDir, "build-" + randomUUID())
  const published = join(snapshot.outputDir, "publish-" + randomUUID())
  const output = resolve(options.root, options.outDir ?? "dist")
  if (
    !safeInside(resolve(options.root), output) ||
    safeInside(output, directory) ||
    safeInside(directory, output)
  )
    throw new Error(`Unsafe site output: ${output}`)
  const existing = await stat(output).catch(() => null)
  if (
    existing &&
    !(await readFile(join(output, outputMarker), "utf8").catch(() => ""))
  )
    throw new Error(`Refusing to replace unowned site output: ${output}`)
  const site = await prepareSite(snapshot, directory, staging)
  try {
    const manifestPath = fileURLToPath(
      import.meta.resolve("@react-router/dev/package.json"),
    )
    const manifest: unknown = JSON.parse(await readFile(manifestPath, "utf8"))
    if (
      !manifest ||
      typeof manifest !== "object" ||
      !("bin" in manifest) ||
      !manifest.bin ||
      typeof manifest.bin !== "object" ||
      !("react-router" in manifest.bin) ||
      typeof manifest.bin["react-router"] !== "string"
    )
      throw new Error("Missing Framework CLI entry")
    const cli = resolve(dirname(manifestPath), manifest.bin["react-router"])
    await new Promise<void>((resolve, reject) => {
      const child = spawn(process.execPath, [cli, "build"], {
        cwd: directory,
        env: { ...process.env, NODE_ENV: "production" },
        stdio: "inherit",
      })
      child.once("error", reject)
      child.once("exit", (code, signal) =>
        code === 0
          ? resolve()
          : reject(new Error(`Framework build failed: ${signal ?? code}`)),
      )
    })
    const client = join(staging, "client")
    const prefix = site.base.slice(1, -1)
    await cp(prefix ? join(client, prefix) : client, published, {
      recursive: true,
    })
    if (prefix)
      await cp(join(client, "assets"), join(published, "assets"), {
        recursive: true,
      })
    await rm(join(published, "__spa-fallback.html"), { force: true })
    for (const document of [...site.documents, ...site.homes]) {
      const path = resolve(published, "." + document.route, "index.html")
      if (!safeInside(published, path))
        throw new Error(`Unsafe HTML output: ${path}`)
      const html = await readFile(path, "utf8")
      if (/<!--\$[?!]-->|<template id="B:|<div hidden id="S:/.test(html))
        throw new Error(
          `Static output contains a runtime rendering boundary: ${document.route}`,
        )
      if (
        !html.includes("<html") ||
        !html.includes("<main") ||
        !html.includes("<title")
      )
        throw new Error(`Incomplete prerender output: ${document.route}`)
    }
    for (const path of snapshot.dependencies)
      if (/\.(?:svg|png|jpe?g|webp|avif|gif)$/i.test(path)) {
        const bytes = await readFile(path)
        await mkdir(join(published, "_content"), { recursive: true })
        await writeFile(
          join(published, "_content", assetName(path, bytes)),
          bytes,
        )
      }
    await writeFile(
      join(published, outputMarker),
      JSON.stringify({ version: 1, base: site.base }) + "\n",
    )
    const backup = output + ".previous-" + randomUUID()
    if (existing) await rename(output, backup)
    try {
      await rename(published, output)
    } catch (error) {
      if (existing) await rename(backup, output)
      throw error
    }
    if (existing) await rm(backup, { recursive: true })
    const result = { output, documents: site.documents.length }
    for (const plugin of snapshot.config.plugins ?? [])
      await plugin.buildEnd?.(result)
    return result
  } finally {
    await rm(staging, { recursive: true, force: true })
    await rm(published, { recursive: true, force: true })
  }
}
