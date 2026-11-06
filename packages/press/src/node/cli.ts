#!/usr/bin/env node
import { generate, watchProject } from "./index"
import { parseCli } from "./cli-options"
const { args, command } = parseCli(process.argv.slice(2))
const options = {
  root: args.root ?? process.cwd(),
  ...(args.config ? { configFile: args.config } : {}),
}
if (
  !["generate", "check", "watch", "dev", "build", "preview"].includes(command)
)
  throw new Error(`Unknown documentation command: ${command}`)
if (["dev", "build", "preview"].includes(command)) {
  const site = await import("../site/index")
  const port = args.port === undefined ? undefined : Number(args.port)
  if (
    port !== undefined &&
    (!Number.isInteger(port) || port < 0 || port > 65535)
  )
    throw new Error("Invalid --port")
  const siteOptions = {
    ...options,
    ...(port !== undefined ? { port } : {}),
    ...(args["out-dir"] ? { outDir: args["out-dir"] } : {}),
  }
  try {
    if (command === "build") console.info(await site.buildSite(siteOptions))
    else {
      const server =
        command === "dev"
          ? await site.devSite(siteOptions)
          : await site.previewSite(siteOptions)
      for (const signal of ["SIGINT", "SIGTERM"] as const)
        process.once(signal, () => {
          void server.close()
        })
    }
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  }
} else if (command === "watch") {
  const close = watchProject(options, (snapshot, error) => {
    if (error) console.error(error)
    else console.info(`Generated ${snapshot?.documents.length ?? 0} documents`)
  })
  for (const signal of ["SIGINT", "SIGTERM"] as const)
    process.once(signal, () => {
      void close().then(() => {
        process.exitCode = 0
      })
    })
} else {
  try {
    const snapshot = await generate(options, command === "check")
    console.info(`${command}: ${snapshot.documents.length} documents`)
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  }
}
