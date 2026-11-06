import process from "node:process"
import console from "node:console"
import { URL } from "node:url"
import assert from "node:assert/strict"
import { resolve, join } from "node:path"
import { mkdir, mkdtemp, rm } from "node:fs/promises"
import { test } from "@playwright/test"
import { previewSite } from "@yuzur1ha/press/site"
import { execFile } from "node:child_process"
import { promisify } from "node:util"
const execute = promisify(execFile)
const run = (command, args, options) =>
  command === "pnpm" && process.env.npm_execpath
    ? execute(process.execPath, [process.env.npm_execpath, ...args], options)
    : execute(command, args, options)
test("serves root and subpath builds with hydration, licenses and deep links", async ({
  browser,
}) => {
  test.setTimeout(180_000)
  const root = resolve(import.meta.dirname, "..")
  const repository = resolve(root, "../..")
  await mkdir(join(root, ".cache"), { recursive: true })
  const temporary = await mkdtemp(join(root, ".cache/pages-"))
  const output = join(temporary, "dist")
  await mkdir(join(repository, "test-results/pages"), { recursive: true })
  try {
    for (const base of ["/", "/yuzur1ha-oss/"]) {
      await run("pnpm", ["exec", "yupress", "build", "--out-dir", output], {
        cwd: root,
        env: { ...process.env, YUPRESS_BASE: base },
        maxBuffer: 8_000_000,
      })
      await run(process.execPath, ["scripts/copy-licenses.mjs", output], {
        cwd: root,
      })
      const server = await previewSite({ root, port: 0, outDir: output })
      const address = server.address()
      if (!address || typeof address === "string")
        throw new Error("Missing preview address")
      const origin = `http://127.0.0.1:${address.port}`
      const page = await browser.newPage()
      const errors = []
      page.on("pageerror", (error) => errors.push(error.message))
      try {
        for (const font of ["instrument-sans", "jetbrains-mono"]) {
          const license = await page.request.get(
            origin + base + `licenses/${font}.txt`,
          )
          assert.equal(license.status(), 200)
          assert.match(await license.text(), /SIL OPEN FONT LICENSE/i)
        }
        for (const viewport of [
          { width: 1440, height: 1000 },
          { width: 390, height: 844 },
        ]) {
          await page.setViewportSize(viewport)
          for (const route of ["ui/button/", "zh-cn/press/"]) {
            const response = await page.goto(origin + base + route)
            assert.equal(response.status(), 200)
            await page.locator("main[data-press-ready=true]").waitFor()
            await page.reload()
            await page.locator("main[data-press-ready=true]").waitFor()
            const broken = await page
              .locator('link[rel="icon"],script[src],link[rel="stylesheet"]')
              .evaluateAll((elements) =>
                elements.map((element) => element.src ?? element.href),
              )
            for (const url of broken)
              assert.equal((await page.request.get(url)).status(), 200)
          }
        }
        await page.goto(origin + base + "markdown/#typography-gfm")
        const moved = page.locator("#typography-gfm")
        assert.equal(
          await moved.getAttribute("href"),
          base + "markdown/typography/",
        )
        await moved.click()
        assert.equal(
          new URL(page.url()).pathname,
          base + "markdown/typography/",
        )
        await page.locator(".press-table-scroll").waitFor()
        await page.goto(origin + base + "press/code-blocks/")
        await page.locator(".yu-code-panel .press-code").first().waitFor()
        const response = await page.goto(origin + base + "missing/")
        assert.equal(response.status(), 404)
        await page
          .getByRole("heading", { name: "Page not found", exact: true })
          .waitFor()
        assert.deepEqual(errors, [])
        await page.goto(origin + base + "ui/button/")
        await page.locator("main[data-press-ready=true]").waitFor()
        await page.screenshot({
          path: join(
            repository,
            `test-results/pages/${base === "/" ? "root" : "subpath"}.png`,
          ),
          fullPage: true,
        })
      } finally {
        await page.close()
        await new Promise((resolve) => server.close(resolve))
      }
    }
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
  console.log(
    "Root and Pages base: desktop/mobile hydration, deep-link refresh, locales, resources and 404 passed",
  )
})
