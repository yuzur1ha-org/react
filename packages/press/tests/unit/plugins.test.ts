import { mkdir, readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { expect, it } from "vitest"
import { generate, loadYuPressConfig } from "../../src/node/index"
import { fixture } from "./vite-fixture"

it("resolves async config, scopes sessions, tracks reads and orders transform/validation/disposal", async () => {
  const root = await fixture()
  const path = join(root, "yupress.config.ts")
  const original = (await readFile(path, "utf8")).replace(
    "export default defineConfig",
    "const base = defineConfig",
  )
  await writeFile(join(root, "extra.json"), '{"title":"Plugin title"}')
  await writeFile(
    path,
    `import {appendFileSync} from 'node:fs'\n${original}
export default defineConfig(async ({command}) => ({...base,
 plugins: [...base.plugins, {name:'audit', setup(context) {
   const extra=context.json('extra.json')
   const record=stage=>appendFileSync(context.resolve('events.log'),stage+'\\n')
   record('setup:'+command)
   return {transformDocument(document) {record('transform');return {...document,metadata:{...document.metadata,title:extra.title}}},
    validate(documents) {if(documents[0].metadata.title!==extra.title) throw Error('order'); record('validate')},
    dispose() {record('dispose')}}
 }}], vite: async environment=>({define:{MODE:JSON.stringify(environment.command)}})
}))`,
  )
  const snapshot = await generate({ root })
  expect(snapshot.documents[0]?.metadata).toMatchObject({
    title: "Plugin title",
  })
  expect(snapshot.inputs.has(join(root, "extra.json"))).toBe(true)
  expect(
    (await readFile(join(root, "events.log"), "utf8")).trim().split("\n"),
  ).toEqual(["setup:generate", "transform", "validate", "dispose"])
  const { config } = await loadYuPressConfig({ root })
  expect(typeof config.vite).toBe("function")
})

it("rejects duplicate plugin names and multiple compiler claims", async () => {
  const root = await fixture()
  const path = join(root, "yupress.config.ts")
  const original = (await readFile(path, "utf8")).replace(
    "export default defineConfig",
    "const base = defineConfig",
  )
  await writeFile(
    path,
    `${original}\nbase.plugins.push(base.plugins[0]);export default base`,
  )
  await expect(generate({ root })).rejects.toThrow("duplicate YuPress plugin")
  await writeFile(
    path,
    `${original}\nbase.plugins.push({...base.plugins[0],name:'second'});export default base`,
  )
  await expect(generate({ root })).rejects.toThrow(
    "Multiple YuPress content plugins",
  )
})

it("disposes initialized sessions on compile errors and reports cleanup failures", async () => {
  const root = await fixture()
  const path = join(root, "yupress.config.ts")
  const original = (await readFile(path, "utf8")).replace(
    "export default defineConfig",
    "const base = defineConfig",
  )
  await writeFile(
    path,
    `${original}
base.plugins.push({name:'failure',setup() {return {transformDocument(){throw Error('compile failed')},dispose(){throw Error('cleanup failed')}}}});export default base`,
  )
  await expect(generate({ root })).rejects.toMatchObject({
    message: "YuPress plugin cleanup failed",
    errors: [
      expect.objectContaining({ message: "compile failed" }),
      expect.objectContaining({ message: "cleanup failed" }),
    ],
  })
})

it("awaits async disposal strictly in reverse setup order", async () => {
  const root = await fixture()
  const path = join(root, "yupress.config.ts")
  const original = (await readFile(path, "utf8")).replace(
    "export default defineConfig",
    "const base = defineConfig",
  )
  await writeFile(
    path,
    `import {appendFileSync} from 'node:fs'
import {setTimeout as delay} from 'node:timers/promises'
${original}
for (const [name,wait] of [['first',1],['second',15]]) base.plugins.push({name,setup(context){return {async dispose(){await delay(wait);appendFileSync(context.resolve('disposed.log'),name+'\\n')}}}})
export default base`,
  )
  await generate({ root })
  expect(
    (await readFile(join(root, "disposed.log"), "utf8")).trim().split("\n"),
  ).toEqual(["second", "first"])
})

it("selects a nested locale before the root source fallback", async () => {
  const root = await fixture()
  await mkdir(join(root, "content/zh-cn"), { recursive: true })
  await writeFile(join(root, "content/index.md"), "# English")
  await writeFile(join(root, "content/zh-cn/index.md"), "# 中文")
  await writeFile(
    join(root, "yupress.config.ts"),
    `
export default {content:{include:["index.md","zh-cn/*.md"]},site:{title:"Locales",locales:[
{id:"en",lang:"en",label:"English",sourceDir:"",prefix:""},
{id:"zh-cn",lang:"zh-CN",label:"中文",sourceDir:"zh-cn",prefix:"zh-cn"}
]}}`,
  )
  const snapshot = await generate({ root })
  expect(
    snapshot.documents.map((item) => [item.locale, item.route]).sort(),
  ).toEqual([
    ["en", "/"],
    ["zh-cn", "/zh-cn/"],
  ])
})
