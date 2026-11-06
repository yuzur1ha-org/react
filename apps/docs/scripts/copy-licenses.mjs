import { URL } from "node:url"
import { cp, mkdir } from "node:fs/promises"
const output = new URL("../dist/licenses/", import.meta.url)
await mkdir(output, { recursive: true })
await cp(new URL("../licenses/", import.meta.url), output, { recursive: true })
