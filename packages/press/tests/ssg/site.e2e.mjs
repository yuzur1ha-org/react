import assert from "node:assert/strict"
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises"
import { resolve, join } from "node:path"
import { fileURLToPath, URL } from "node:url"
import { buildSite, previewSite } from "@yuzur1ha/press/site"

import { test, expect } from "@playwright/test"

test("renders static pages and hydrates accessible navigation", async ({
  browser,
}) => {
  test.setTimeout(180_000)
  const packageRoot = fileURLToPath(new URL("../../", import.meta.url))
  await mkdir(resolve(packageRoot, ".cache"), { recursive: true })
  const root = await mkdtemp(resolve(packageRoot, ".cache/ssg-"))
  let server
  try {
    const headerLinks = [
      ...Array.from({ length: 24 }, (_, index) => ({
        label: `Resource ${index + 1}`,
        href: `https://example.com/resource-${index + 1}`,
      })),
      ...Array.from({ length: 10 }, (_, index) => ({
        label: `Repository ${index + 1}`,
        href: `https://example.com/repository-${index + 1}`,
        icon: "github",
      })),
    ]
    await writeFile(
      join(root, "yupress.config.ts"),
      `import { defineConfig } from '@yuzur1ha/press'
import {writeFileSync} from 'node:fs'
import {join} from 'node:path'
export default defineConfig({theme:"@yuzur1ha/press-theme",plugins:[{name:'verify:published',setup:()=>({}),buildEnd(result){writeFileSync(join(result.output,'finished.json'),JSON.stringify(result))}}],site:{title:'Press review',base:'/manual/',home:{content:'index',hero:{text:'Build with Press',tagline:'A configurable home',actions:[{text:'Read guide',link:'/guide/'}]},features:[{title:'Static HTML',description:'Readable before JavaScript.'}]},footer:{message:'A small, deliberate footer'},links:${JSON.stringify(headerLinks)},locales:[
{id:'en',lang:'en',label:'English',sourceDir:'en',prefix:''},
{id:'zh-cn',lang:'zh-CN',label:'中文',sourceDir:'zh-cn',prefix:'zh-cn',messages:{theme:'主题',language:'语言',menu:'文档目录',docs:'文档目录'},home:{content:'index',hero:{text:'使用 Press',actions:[{text:'阅读指南',link:'/zh-cn/guide/'}]}}}]}})
`,
    )
    for (const [locale, title] of [
      ["en", "English guide"],
      ["zh-cn", "中文指南"],
    ]) {
      await mkdir(join(root, "content", locale), { recursive: true })
      await writeFile(
        join(root, "content", locale, "index.md"),
        `# Home ${locale}\n\nMarkdown home body ${locale}.\n`,
      )
      await writeFile(
        join(root, "content", locale, "guide.md"),
        `# ${title}\n\nStatic ${locale} body.\n\n## Reading\n\n[Other page](./other.md)\n${Array.from({ length: 45 }, (_, index) => `\n## Topic ${index + 1}\n\nReading section ${index + 1}.\n`).join("")}\n\n\`\`\`text\n${"Wide source line. ".repeat(100)}\n\`\`\`\n`,
      )
      await writeFile(
        join(root, "content", locale, "other.md"),
        `# Other ${locale}\n\nSecond document.\n`,
      )
    }
    const published = await buildSite({ root })
    assert.deepEqual(
      JSON.parse(
        await readFile(join(published.output, "finished.json"), "utf8"),
      ),
      published,
    )
    server = await previewSite({ root, port: 0 })
    const address = server.address()
    assert.ok(address && typeof address === "object")
    const origin = `http://127.0.0.1:${address.port}`
    const noJs = await browser.newContext({ javaScriptEnabled: false })
    const staticPage = await noJs.newPage()
    await staticPage.goto(origin + "/manual/guide/")
    await staticPage
      .getByRole("heading", { name: "English guide", exact: true })
      .waitFor()
    assert.equal(
      await staticPage
        .getByRole("navigation", { name: "On this page", exact: true })
        .getByRole("link", { name: "Reading", exact: true })
        .count(),
      1,
    )
    await staticPage.goto(origin + "/manual/zh-cn/guide/")
    await staticPage
      .getByRole("heading", { name: "中文指南", exact: true })
      .waitFor()
    await staticPage.goto(origin + "/manual/")
    await staticPage
      .getByRole("heading", { name: "Build with Press", exact: true })
      .waitFor()
    assert.equal(
      await staticPage
        .getByRole("link", { name: "Read guide", exact: true })
        .getAttribute("href"),
      "/manual/guide/",
    )
    assert.equal(
      await staticPage.locator(".press-footer").getAttribute("data-layout"),
      "home",
    )
    await staticPage
      .getByRole("link", { name: "Read guide", exact: true })
      .click()
    await staticPage
      .getByRole("heading", { name: "English guide", exact: true })
      .waitFor()
    await staticPage.goto(origin + "/manual/")
    await staticPage
      .getByText("Markdown home body en.", { exact: true })
      .waitFor()
    await noJs.close()
    for (const viewport of [
      { width: 1280, height: 800 },
      { width: 390, height: 844 },
    ]) {
      const context = await browser.newContext({ viewport })
      const page = await context.newPage()
      const errors = []
      page.on("pageerror", (error) => errors.push(error.message))
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text())
      })
      page.on("response", (response) => {
        if (response.status() >= 400) errors.push(response.url())
      })
      await page.goto(origin + "/manual/guide/")
      await page.locator('main[data-press-ready="true"]').waitFor()
      const codePanel = page.locator(".press-prose .yu-code-panel")
      await expect(codePanel).toHaveAttribute("data-source-ready", "true")
      const codeViewport = codePanel.getByRole("region")
      await expect
        .poll(() =>
          codeViewport.evaluate((node) => node.scrollWidth > node.clientWidth),
        )
        .toBe(true)
      await codeViewport.focus()
      await codeViewport.press("ArrowRight")
      await expect
        .poll(() => codeViewport.evaluate((node) => node.scrollLeft))
        .toBeGreaterThan(0)
      if (viewport.width < 640)
        await page
          .locator(".press-phone-navigation")
          .getByRole("button")
          .click()
      await page
        .getByRole("switch", { name: "Theme", exact: true })
        .locator("..")
        .click()
      assert.equal(
        await page.locator("html").getAttribute("data-theme"),
        "dark",
      )
      if (viewport.width < 640) {
        const drawer = page.getByRole("dialog", {
          name: "Navigation",
          exact: true,
        })
        await expect(drawer.locator(".press-drawer-text-links a")).toHaveCount(
          24,
        )
        await expect(drawer.locator(".press-icon-links a")).toHaveCount(10)
        await expect(
          drawer.locator(".press-drawer-text-links a").first(),
        ).toHaveCSS("color", "rgb(238, 237, 232)")
        const scroll = drawer.locator(
          ".press-drawer-scroll > .yu-scroll-viewport",
        )
        assert.ok(
          await scroll.evaluate(
            (node) => node.scrollHeight > node.clientHeight,
          ),
        )
        const before = await page.evaluate(() => globalThis.scrollY)
        await drawer.locator(".press-icon-links a").last().focus()
        assert.equal(await page.evaluate(() => globalThis.scrollY), before)
      }
      await page
        .getByRole("combobox", { name: "Language", exact: true })
        .click()
      await page.getByRole("option", { name: "中文", exact: true }).click()
      await page
        .getByRole("heading", { name: "中文指南", exact: true })
        .waitFor()
      assert.equal(await page.locator("html").getAttribute("lang"), "zh-CN")
      await page.reload()
      await page.waitForFunction(
        () => globalThis.document.documentElement.dataset.theme === "dark",
      )
      if (viewport.width < 640) {
        const trigger = page.locator(".press-subheader").getByRole("button", {
          name: "文档目录",
          exact: true,
        })
        await trigger.click()
        assert.equal(await trigger.getAttribute("aria-expanded"), "true")
        await page.keyboard.press("Escape")
        assert.equal(await trigger.getAttribute("aria-expanded"), "false")
        await expect(trigger).toBeFocused()
      }
      if (viewport.width < 640)
        await page
          .getByRole("button", { name: "On this page", exact: true })
          .click()
      const outline = page.locator(
        viewport.width < 640
          ? ".press-outline-popover .yu-scroll-viewport"
          : ".press-toc .yu-scroll-viewport",
      )
      await outline.focus()
      const beforeScroll = await page.evaluate(() => globalThis.scrollY)
      await outline.press("End")
      await expect
        .poll(() => outline.evaluate((node) => node.scrollTop))
        .toBeGreaterThan(0)
      assert.equal(await page.evaluate(() => globalThis.scrollY), beforeScroll)
      if (viewport.width < 640) {
        await expect(page.locator(".press-outline-popover")).toHaveCSS(
          "padding",
          "0px",
        )
        await page.keyboard.press("Escape")
      }
      assert.deepEqual(errors, [])
      await page.goto(origin + "/manual/")
      await page.locator('main[data-press-ready="true"]').waitFor()
      if (viewport.width < 640)
        await page
          .locator(".press-phone-navigation")
          .getByRole("button")
          .click()
      await page
        .getByRole("combobox", { name: "Language", exact: true })
        .click()
      await page.getByRole("option", { name: "中文", exact: true }).click()
      await page
        .getByRole("heading", { name: "使用 Press", exact: true })
        .waitFor()
      assert.equal(
        await page.locator(".press-footer").getAttribute("data-layout"),
        "home",
      )
      await page.getByRole("link", { name: "阅读指南", exact: true }).click()
      await page
        .getByRole("heading", { name: "中文指南", exact: true })
        .waitFor()
      assert.equal(
        await page.locator(".press-footer").getAttribute("data-layout"),
        "docs",
      )
      assert.deepEqual(errors, [])
      await context.close()
    }
    await new Promise((resolve) => server.close(resolve))
    server = undefined
  } finally {
    if (server) await new Promise((resolve) => server.close(resolve))
    await rm(root, { recursive: true, force: true })
  }
})
