import { execFile } from "node:child_process"
import { promisify } from "node:util"
const execute = promisify(execFile)
export function run(command, args, options) {
  if (command === "pnpm" && process.env.npm_execpath)
    return execute(
      process.execPath,
      [process.env.npm_execpath, ...args],
      options,
    )
  return execute(command, args, options)
}
