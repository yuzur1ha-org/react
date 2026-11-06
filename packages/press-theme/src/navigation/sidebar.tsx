import { darkTokens, mediaQueries, toCSSVariables } from "@yuzur1ha/token"
import { SiteBrand } from "../header/brand"
import { css } from "@emotion/react"
import { Menu, MenuGroup, ScrollArea, siteHeaderStyles } from "@yuzur1ha/ui"
import type { SiteDocument, SiteSection } from "@yuzur1ha/press/content"
import { useMessages } from "../context"
import { SiteMenuItem } from "../links"
export type SidebarProps = {
  groups: NonNullable<SiteSection["groups"]>
  sidebar: SiteDocument[]
  document?: SiteDocument
  section?: SiteSection
}
export function SidebarMenu({
  onNavigate,
  groups,
  sidebar,
  document,
  section,
}: SidebarProps & { onNavigate?: () => void }) {
  const text = useMessages()
  return (
    <Menu
      label={text.menu}
      css={css`
        padding: 24px 20px 40px;
        .yu-menu-item {
          font-size: 14px;
          line-height: 20px;
        }
      `}
    >
      {groups.map((group) => (
        <MenuGroup key={group.id} label={group.label}>
          {group.documents
            .map((key) =>
              sidebar.find((item) => item.key === key || item.id === key),
            )
            .map((item) =>
              item ? (
                <SiteMenuItem
                  key={item.key}
                  href={item.route}
                  onClick={onNavigate}
                  active={document?.key === item.key}
                >
                  {section?.labels?.[item.key] ??
                    section?.labels?.[item.id] ??
                    item.metadata.title}
                </SiteMenuItem>
              ) : null,
            )}
        </MenuGroup>
      ))}
    </Menu>
  )
}
export function SiteSidebar({
  title,
  logo,
  home,
  ...props
}: SidebarProps & {
  title: string
  home: string
  logo?: { src: string; alt: string }
}) {
  const text = useMessages()
  return (
    <aside
      id="press-sidebar"
      className="press-sidebar"
      css={css`
        position: fixed;
        inset: 0 auto 0 0;
        width: var(--press-sidebar-width);
        z-index: 30;
        border-right: 1px solid var(--yu-border);
        background: var(--yu-paper);
        display: flex;
        flex-direction: column;
        > .press-sidebar-brand {
          height: var(--press-header-expanded);
          flex: none;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 var(--press-brand-inset);
          text-decoration: none;
          &::before {
            content: "";
            position: absolute;
            inset: 0;
            z-index: -1;
            background: color-mix(in srgb, #171819 88%, transparent);
            backdrop-filter: blur(18px);
          }
          position: relative;
          isolation: isolate;
          border-bottom: 1px solid color-mix(in srgb, #fff 12%, transparent);
        }
        > .press-directory {
          flex: 1;
          min-height: 0;
        }
        @media ${mediaQueries.phone} {
          display: none;
        }
      `}
    >
      <div
        className="press-sidebar-brand dark-surface"
        css={siteHeaderStyles}
        style={toCSSVariables(darkTokens)}
      >
        <SiteBrand site={{ title, ...(logo ? { logo } : {}) }} home={home} />
      </div>
      <ScrollArea
        className="press-directory"
        label={text.menu}
        overscrollBehavior="contain"
      >
        <SidebarMenu {...props} />
      </ScrollArea>
    </aside>
  )
}
