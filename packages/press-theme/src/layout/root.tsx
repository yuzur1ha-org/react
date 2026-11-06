import createCache from "@emotion/cache"
import { CacheProvider, Global } from "@emotion/react"
import { markdownStyles } from "@yuzur1ha/token/markdown"
import { css } from "@emotion/react"
import { darkTokens, toCSSVariables, tokens } from "@yuzur1ha/token"
import { DocumentScrollStyles, UIProvider } from "@yuzur1ha/ui"
import { useEffect, useState, type CSSProperties, type ReactNode } from "react"
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router"
import {
  contentRoute,
  resolveMessages,
  type PublicSite,
} from "@yuzur1ha/press/content"
import { SiteContext, MessagesContext, localeForPath } from "../context"
import { InitialHashContext } from "../navigation/use-document-hash"
import { HashMotion } from "../navigation/hash-motion"
import { PageLoading } from "../feedback/page-loading"
import { SiteHeader } from "../header/header"
import { SiteSidebar } from "../navigation/sidebar"
import { SiteSubheader } from "../navigation/subheader"
import {
  OutlineContext,
  outlinePopoverStyles,
  type OutlineState,
} from "../navigation/outline"
import { readingNavigation } from "../navigation/navigation-model"
import { SiteFooter } from "./footer"
import { globalStyles, hashMotionStyles } from "./global.styles"
import { layoutStyles } from "./layout.styles"
export function SiteRoot({
  site,
  children,
  error,
}: {
  site: PublicSite
  children?: ReactNode
  error?: ReactNode
}) {
  const location = useLocation()
  const [initialHash] = useState(() => ({
    key: location.key,
    pending: Boolean(location.hash),
  }))
  const document = site.documents.find(
    (item) => decodeURI(item.route) === decodeURI(location.pathname),
  )
  const locale = localeForPath(site, location.pathname),
    text = resolveMessages(site, locale?.id)
  const isHome = site.homes.some(
    (item) => decodeURI(item.route) === decodeURI(location.pathname),
  )
  const isDocs = Boolean(document) && !error
  const translationMissing =
    new URLSearchParams(location.search).get("translation") === "missing"
  const [cache] = useState(() => createCache({ key: "yupress" }))
  const [outline, setOutline] = useState<OutlineState>()
  const [dark, setDark] = useState(false)
  useEffect(() => {
    try {
      setDark(localStorage.getItem(site.themeStorageKey) === "dark")
    } catch {
      /* Theme storage is optional. */
    }
  }, [site.themeStorageKey])
  const changeTheme = (value: boolean) => {
    setDark(value)
    try {
      localStorage.setItem(site.themeStorageKey, value ? "dark" : "light")
    } catch {
      /* Theme storage is optional. */
    }
  }
  const localized = site.documents.filter((item) => item.locale === locale?.id)
  const directory = readingNavigation(site, document, locale?.id ?? "")
  const section = directory.section
  const home =
    site.homes.find((item) => item.locale === locale?.id)?.route ??
    (locale
      ? localized.find(
          (item) => item.route === contentRoute("index.md", locale),
        )?.route
      : undefined) ??
    localized[0]?.route ??
    "/404/"
  const headings =
    outline?.documentKey === document?.key
      ? (outline?.headings ?? [])
      : (document?.metadata.toc ?? [])
  const variables = toCSSVariables(dark ? darkTokens : tokens) as CSSProperties
  return (
    <html lang={locale?.lang ?? "en"} data-theme={dark ? "dark" : "light"}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {site.favicon && <link rel="icon" href={site.favicon} />}
        <Meta />
        <Links />
      </head>
      <body style={variables}>
        <SiteContext value={site}>
          <MessagesContext value={text}>
            <CacheProvider value={cache}>
              <UIProvider theme={dark ? darkTokens : tokens}>
                <DocumentScrollStyles />
                <Global
                  styles={[
                    globalStyles,
                    hashMotionStyles,
                    outlinePopoverStyles,
                    css(markdownStyles),
                  ]}
                />
                <InitialHashContext value={initialHash}>
                  <OutlineContext value={setOutline}>
                    <div
                      className="press-shell"
                      data-has-outline={isDocs && headings.length > 0}
                      data-translation-missing={translationMissing}
                      css={layoutStyles}
                      data-layout={
                        isHome ? "home" : isDocs ? "docs" : "not-found"
                      }
                    >
                      <a className="press-skip" href="#main">
                        {text.skip}
                      </a>
                      <HashMotion />
                      <PageLoading>
                        <SiteHeader
                          site={site}
                          home={home}
                          isHome={!isDocs}
                          dark={dark}
                          setDark={changeTheme}
                          {...(locale ? { locale } : {})}
                          {...(document ? { document } : {})}
                          {...(section ? { section } : {})}
                        />
                        {isDocs && (
                          <>
                            <SiteSidebar
                              title={site.title}
                              home={home}
                              {...(site.logo ? { logo: site.logo } : {})}
                              {...directory}
                            />
                            <SiteSubheader
                              key={location.pathname}
                              {...directory}
                              headings={headings}
                            />
                          </>
                        )}
                        <div className="press-layout">
                          <div
                            className={
                              isHome
                                ? "press-home-reading"
                                : isDocs
                                  ? "press-reading"
                                  : "press-error-reading"
                            }
                          >
                            {translationMissing && (
                              <p
                                role="status"
                                className="press-translation-notice"
                              >
                                {text.missing}
                              </p>
                            )}
                            {error ?? <Outlet />}
                            {children}
                          </div>
                        </div>
                        <SiteFooter isHome={!isDocs} />
                      </PageLoading>
                    </div>
                  </OutlineContext>
                </InitialHashContext>
              </UIProvider>
            </CacheProvider>
          </MessagesContext>
        </SiteContext>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
