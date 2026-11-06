import mri from "mri"
export function parseCli(argv: string[]) {
  const args = mri<{
    _: string[]
    root?: string
    config?: string
    port?: string
    "out-dir"?: string
  }>(argv, {
    alias: { root: [], config: [], port: [], "out-dir": [] },
    string: ["root", "config", "port", "out-dir"],
    unknown: (flag) => {
      throw new Error(`Unknown option: ${flag}`)
    },
  })
  const [command = "generate", ...extra] = args._
  if (extra.length) throw new Error(`Unexpected arguments: ${extra.join(" ")}`)
  for (const key of ["root", "config", "port", "out-dir"] as const) {
    if (
      args[key] !== undefined &&
      (typeof args[key] !== "string" || !args[key].trim())
    )
      throw new Error(`Missing value for --${key}`)
  }

  return { args, command }
}
