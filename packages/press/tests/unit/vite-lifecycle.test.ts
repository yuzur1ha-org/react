import { readFile, rm, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { build, createServer, resolveConfig } from "vite"
import { expect, it, vi } from "vitest"
import { createDocumentation } from "../../src/vite/index"
import { countGenerations, fixture } from "./vite-fixture"

it("shares dev initialization, recovers from errors and deletion, and closes middleware-mode watchers", async () => {
  const root = await fixture()
  const count = await countGenerations(root)
  const server = await createServer({
    root,
    configFile: false,
    logLevel: "silent",
    plugins: [createDocumentation({ namespace: "fixture" }).plugins()],
    server: { middlewareMode: true, watch: null },
  })
  const events: unknown[] = []
  const send = vi
    .spyOn(server.ws, "send")
    .mockImplementation((message: unknown) => {
      events.push(message)
    })
  try {
    const [document, manifest] = await Promise.all([
      server.transformRequest("/content/hello.md"),
      server.transformRequest("virtual:fixture"),
    ])
    expect(document?.code).toContain("A minimal document.")
    expect(document?.map).toMatchObject({
      sources: ["hello.md"],
    })
    expect(manifest?.code).toContain("manifest.ts")
    expect(await count()).toBe(1)
    expect(events).not.toContainEqual({ type: "full-reload" })
    const source = join(root, "content/hello.md")
    await writeFile(source, "---\nid: greeting\ntitle: false\n---\n# Fallback")
    await expect
      .poll(() =>
        events.some(
          (message) =>
            typeof message === "object" &&
            message !== null &&
            "type" in message &&
            message.type === "error",
        ),
      )
      .toBe(true)
    await expect(server.transformRequest("/content/hello.md")).rejects.toThrow(
      "Invalid title",
    )
    await writeFile(
      source,
      "---\nid: greeting\n---\n# Recovered\n\nRecovered body",
    )
    await expect
      .poll(async () => {
        try {
          return (
            await server.transformRequest("/content/hello.md")
          )?.code.includes("Recovered")
        } catch {
          return false
        }
      })
      .toBe(true)
    await rm(source)
    await expect
      .poll(async () =>
        (
          await readFile(join(root, ".cache/press/documents.d.ts"), "utf8")
        ).includes("never"),
      )
      .toBe(true)
  } finally {
    await server.close()
  }
  const calls = await count()
  const messages = send.mock.calls.length
  await writeFile(
    join(root, "content/hello.md"),
    "---\nid: greeting\n---\n# After close",
  )
  await new Promise((resolve) => setTimeout(resolve, 250))
  expect(await count()).toBe(calls)
  expect(send.mock.calls).toHaveLength(messages)
}, 15000)
it("rejects concurrent reuse of a preset across Vite configurations and releases it after build failure", async () => {
  const root = await fixture()
  const preset = createDocumentation({ namespace: "fixture" }).plugins()
  await resolveConfig({ root, configFile: false, plugins: [preset] }, "build")
  await expect(
    resolveConfig({ root, configFile: false, plugins: [preset] }, "build"),
  ).rejects.toThrow("already configured")
  const failed = createDocumentation({ namespace: "fixture" }).plugins()
  await writeFile(
    join(root, "content/hello.md"),
    "---\nid: greeting\ntitle: false\n---\n# Invalid",
  )
  const buildOptions = {
    root,
    configFile: false as const,
    logLevel: "silent" as const,
    plugins: [failed],
    build: {
      write: false,
      lib: { entry: join(root, "entry.js"), formats: ["es" as const] },
      rollupOptions: { external: ["react/jsx-runtime"] },
    },
  }
  await expect(build(buildOptions)).rejects.toThrow("Invalid title")
  await writeFile(
    join(root, "content/hello.md"),
    "---\nid: greeting\n---\n# Fixed",
  )
  await expect(build(buildOptions)).resolves.toBeDefined()
})
it("recovers a failed first dev generation without restarting Vite", async () => {
  const root = await fixture()
  const source = join(root, "content/hello.md")
  await writeFile(source, "---\nid: greeting\ntitle: false\n---\n# Invalid")
  const server = await createServer({
    root,
    configFile: false,
    logLevel: "silent",
    plugins: [createDocumentation({ namespace: "fixture" }).plugins()],
    server: { middlewareMode: true, watch: null },
  })
  try {
    await expect(server.transformRequest("/content/hello.md")).rejects.toThrow(
      "Invalid title",
    )
    await writeFile(
      source,
      "---\nid: greeting\n---\n# Fixed\n\nFirst generation recovered",
    )
    await expect
      .poll(async () => {
        try {
          return (
            await server.transformRequest("/content/hello.md")
          )?.code.includes("First generation recovered")
        } catch {
          return false
        }
      })
      .toBe(true)
  } finally {
    await server.close()
  }
}, 15000)
it("refreshes the shared snapshot during production watch rebuilds and recovers after errors", async () => {
  const root = await fixture()
  const source = join(root, "content/hello.md")
  const result = await build({
    root,
    configFile: false,
    logLevel: "silent",
    plugins: [createDocumentation({ namespace: "fixture" }).plugins()],
    build: {
      watch: {},
      write: false,
      lib: { entry: join(root, "entry.js"), formats: ["es"] },
      rollupOptions: { external: ["react/jsx-runtime"] },
    },
  })
  if (!("on" in result)) throw new Error("Expected a build watcher")
  let completed = 0
  const errors: unknown[] = []
  result.on("event", (event) => {
    if (event.code === "BUNDLE_END") completed++
    if (event.code === "ERROR") errors.push(event.error)
  })
  try {
    await expect.poll(() => completed).toBeGreaterThan(0)
    await writeFile(source, "---\nid: greeting\ntitle: false\n---\n# Invalid")
    await expect.poll(() => errors.length).toBeGreaterThan(0)
    await writeFile(
      source,
      "---\nid: greeting\n---\n# Watch recovered\n\nUpdated production body",
    )
    await expect
      .poll(
        async () =>
          await readFile(join(root, ".cache/press/manifest.ts"), "utf8"),
      )
      .toContain("Watch recovered")
    await expect.poll(() => completed).toBeGreaterThan(1)
  } finally {
    await result.close()
  }
}, 15000)
