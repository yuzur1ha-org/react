#!/usr/bin/env node
import { parseArgs } from "node:util"
import { buildDeclarations } from "../dist/declarations.js"
const { values } = parseArgs({
  options: {
    config: { type: "string", default: "tsconfig.build.json" },
    "out-dir": { type: "string", default: "dist" },
    shim: { type: "string", multiple: true, default: [] },
  },
})
const shims = values.shim.map((value) => {
  const separator = value.indexOf("=")
  if (separator < 1 || separator === value.length - 1)
    throw new Error("Use --shim source=target")
  return {
    source: value.slice(0, separator),
    target: value.slice(separator + 1),
  }
})
await buildDeclarations({
  config: values.config,
  outDir: values["out-dir"],
  shims,
})
