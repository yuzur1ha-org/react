import { resolve } from "node:path"
import { pathToFileURL } from "node:url"
import process from "node:process"
import { URL } from "node:url"
import { cp, mkdir } from "node:fs/promises"
const output = process.argv[2]
  ? pathToFileURL(resolve(process.argv[2], "licenses") + "/")
  : new URL("../dist/licenses/", import.meta.url)
await mkdir(output, { recursive: true })
await cp(new URL("../licenses/", import.meta.url), output, { recursive: true })
