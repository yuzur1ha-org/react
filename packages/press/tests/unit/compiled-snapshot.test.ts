import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { expect, it } from "vitest"
import {
  compiledDocumentResolver,
  writeCompiledSnapshot,
} from "../../src/site/compiled"

it("reuses a compiled snapshot until replaced and recovers after an invalid revision", async () => {
  const directory = await mkdtemp(join(tmpdir(), "press-compiled-"))
  try {
    const lookup = compiledDocumentResolver(directory)
    const source = "/doc.md"
    const entry = (code: string) => ({ source, code, dependencies: [] })
    const publish = (value: unknown) =>
      writeCompiledSnapshot(directory, JSON.stringify(value))
    await publish([entry("one")])
    const first = lookup(source)
    expect(first?.code).toBe("one")
    expect(lookup(source)).toBe(first)
    await publish([entry("two")])
    expect(lookup(source)?.code).toBe("two")
    await publish([entry("bad"), {}])
    expect(() => lookup(source)).toThrow("Invalid compiled document")
    await publish({ error: "Content failed" })
    expect(() => lookup(source)).toThrow("Content failed")
    await publish([entry("one")])
    expect(lookup(source)?.code).toBe("one")
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
