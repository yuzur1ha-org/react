import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { resolve, join } from "node:path"
import { pathToFileURL } from "node:url"
import { createElement, type ComponentType } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { build } from "vite"
import react from "@vitejs/plugin-react"
import { expect, it, vi } from "vitest"
import { dataExpression } from "../../src/compiler/literal"
import { compileDocument } from "../../src/compiler/index"
import { moduleBindings } from "../../src/compiler/modules"
import { Probe } from "../fixtures/compiler/renderer"

it("preserves nested data, prototype-named keys, negative zero and optional props in a real React module", async () => {
  const payload = {
    ["__proto__"]: { inherited: "data only" },
    constructor: "literal",
    negative: -0,
    optionalField: undefined,
    toJSON: "data",
    nested: [
      -0,
      undefined,
      true,
      null,
      { text: '中文 "quotes" \\ paths\n\u2028\u2029 </script>' },
    ],
  }
  const directory = await mkdtemp(
    resolve(import.meta.dirname, "../../.pipeline-"),
  )
  try {
    const document = await compileDocument("::probe", "fixture.md", {
      analyze: () => ({}),
      directives: {
        probe: {
          kind: "leafDirective",
          render: () => ({
            component: {
              from: resolve(
                import.meta.dirname,
                "../fixtures/compiler/renderer.tsx",
              ),
              name: "Probe",
            },
            props: { payload, optional: undefined },
          }),
        },
      },
    })
    await writeFile(join(directory, "entry.js"), document.code)
    const result = await build({
      configFile: false,
      root: directory,
      plugins: [react()],
      logLevel: "silent",
      build: {
        write: false,
        lib: { entry: join(directory, "entry.js"), formats: ["es"] },
        rollupOptions: { external: ["react", "react/jsx-runtime"] },
      },
    })
    const chunk = (Array.isArray(result) ? result : [result])
      .flatMap((value) => ("output" in value ? value.output : []))
      .find((value) => value.type === "chunk")
    if (chunk?.type !== "chunk") throw new Error("Missing React module")
    await writeFile(join(directory, "document.mjs"), chunk.code)
    const loaded: unknown = await import(
      pathToFileURL(join(directory, "document.mjs")).href
    )
    const isDocument = (value: unknown): value is { default: ComponentType } =>
      !!value &&
      typeof value === "object" &&
      "default" in value &&
      typeof value.default === "function"
    if (!isDocument(loaded)) throw new Error("Missing document export")
    expect(renderToStaticMarkup(createElement(loaded.default))).toBe(
      renderToStaticMarkup(
        createElement(Probe, { payload, optional: undefined }),
      ),
    )
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

it("recognizes only bindings created by the current compiler session", () => {
  const first = moduleBindings()
  const second = moduleBindings()
  const binding = first.reference({ from: "./demo.tsx", name: "Demo" })
  expect(first.reference({ from: "./demo.tsx", name: "Demo" })).toBe(binding)
  expect(first.expression(binding)).toEqual({
    type: "Identifier",
    name: binding.name,
  })
  expect(first.expression({ ...binding }).type).toBe("ObjectExpression")
  expect(second.expression(binding).type).toBe("ObjectExpression")
})

const nullObject: unknown = Object.create(null, {
  key: { value: "value", enumerable: true },
})
it.each(
  [
    null,
    undefined,
    { nested: undefined },
    [undefined],
    true,
    false,
    0,
    -15,
    1.25,
    "text",
    [],
    { nested: [1, "value"] },
    nullObject,
  ].map((value) => ({ value })),
)("accepts JSON data: $value", ({ value }) => {
  expect(() => dataExpression(value)).not.toThrow()
})
it.each(
  [
    NaN,
    Infinity,
    -Infinity,
    1n,
    Symbol("value"),
    () => undefined,
    new Date(0),
    new Map(),
    new Array<unknown>(2),
  ].map((value) => ({ value })),
)(
  "rejects unsupported data instead of silently changing it: $value",
  ({ value }) => {
    expect(() => dataExpression(value)).toThrow(TypeError)
  },
)
it("rejects cycles and serialization hooks without invoking user code, while allowing shared data", () => {
  const cycle: Record<string, unknown> = {}
  cycle.self = cycle
  expect(() => dataExpression(cycle)).toThrow("circular")
  const getter = vi.fn(() => "executed")
  const hook = vi.fn(() => "executed")
  expect(() =>
    dataExpression(
      Object.defineProperty({}, "value", { enumerable: true, get: getter }),
    ),
  ).toThrow("accessors")
  expect(() =>
    dataExpression(Object.defineProperty({}, "toJSON", { value: hook })),
  ).toThrow("custom serialization")
  expect(getter).not.toHaveBeenCalled()
  expect(hook).not.toHaveBeenCalled()
  const shared = { value: 1 }
  expect(() => dataExpression({ first: shared, second: shared })).not.toThrow()
})

it("locates unsupported component prop data at its directive", async () => {
  await expect(
    compileDocument("Text\n\n::probe", "content/example.md", {
      analyze: () => ({}),
      directives: {
        probe: {
          kind: "leafDirective",
          render: () => ({
            component: { from: "./renderer.tsx", name: "Probe" },
            props: { value: new Date(0) },
          }),
        },
      },
    }),
  ).rejects.toMatchObject({ line: 3, column: 1 })
})
