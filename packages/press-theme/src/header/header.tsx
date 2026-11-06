import { UIProvider, Menu, siteHeaderStyles } from "@yuzur1ha/ui"
import { darkTokens, tokens, toCSSVariables } from "@yuzur1ha/token"
import type {
  ContentLocale,
  PublicSite,
  SiteDocument,
  SiteSection,
} from "@yuzur1ha/press/content"
import { useMessages } from "../context"
import { SiteBrand } from "./brand"
import { SectionLinks } from "./section-links"
import { HeaderDrawer } from "./header-drawer"
import { HeaderLinks } from "./header-links"
import { HeaderControls } from "./header-controls"
import { useHeaderScroll } from "./use-header-scroll"
import { headerStyles, siteNavigationStyles } from "./header.styles"
export type HeaderProps = {
  site: PublicSite
  document?: SiteDocument
  locale?: ContentLocale
  section?: SiteSection
  home: string
  isHome: boolean
  dark: boolean
  setDark: (dark: boolean) => void
}
export function SiteHeader(props: HeaderProps) {
  const { site, locale, section, home, isHome, dark } = props
  const text = useMessages(),
    header = useHeaderScroll()
  const theme = dark ? darkTokens : tokens
  return (
    <UIProvider theme={theme}>
      <header
        ref={header}
        className="press-header"
        data-layout={isHome ? "home" : "docs"}
        data-site-header
        css={[siteHeaderStyles, headerStyles]}
        style={toCSSVariables(theme)}
      >
        <div
          className="press-header-brand"
          style={isHome ? undefined : toCSSVariables(darkTokens)}
        >
          <SiteBrand
            site={site}
            home={home}
            tone={isHome ? "inherit" : "dark"}
          />
        </div>
        <div className="press-desktop-navigation">
          <Menu
            className="press-site-navigation"
            css={siteNavigationStyles}
            label={text.sections}
            orientation="horizontal"
            appearance="subtle"
            activeAppearance="subtle"
            size="small"
          >
            <SectionLinks
              site={site}
              {...(locale ? { locale } : {})}
              {...(section ? { section } : {})}
            />
          </Menu>
          <div className="press-inline-text-links">
            <HeaderLinks site={site} />
          </div>
        </div>
        <div className="press-header-actions">
          <HeaderLinks site={site} />
          <HeaderLinks site={site} icons />
          <HeaderControls {...props} />
        </div>
        <HeaderDrawer {...props} />
        <noscript>
          <style>{`.press-header .press-phone-navigation{display:none!important}`}</style>
          <div className="press-static-navigation">
            <Menu label={text.sections} orientation="horizontal" size="small">
              <SectionLinks site={site} {...(locale ? { locale } : {})} />
            </Menu>
          </div>
        </noscript>
      </header>
    </UIProvider>
  )
}
