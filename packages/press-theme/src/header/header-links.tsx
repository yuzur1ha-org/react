import type { PublicSite } from "@yuzur1ha/press/content"
import {
  headerTextLinkStyles,
  headerIconLinkStyles,
} from "./header-links.styles"
import { Menu, ScrollArea } from "@yuzur1ha/ui"
import { useMessages } from "../context"
import { SiteMenuItem, SiteCardLink, SiteLink } from "../links"

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.57 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.15a10.8 10.8 0 0 1 5.64 0c2.15-1.45 3.1-1.15 3.1-1.15.61 1.55.23 2.7.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.33-2.64 5.28-5.15 5.56.4.35.76 1.03.76 2.08v3.11c0 .3.2.65.77.54A11.25 11.25 0 0 0 12 .75Z" />
    </svg>
  )
}
export function HeaderLinks({
  site,
  icons = false,
}: {
  site: PublicSite
  icons?: boolean
}) {
  const text = useMessages()
  const links = site.links.filter((link) => Boolean(link.icon) === icons)
  if (!links.length) return null
  const content = (
    <div className={icons ? "press-icon-links" : "press-text-links"}>
      {links.map((link) =>
        icons ? (
          <SiteCardLink
            key={`${link.href}:${link.label}`}
            href={link.href}
            target="_blank"
            className="press-icon-link"
            css={headerIconLinkStyles}
            underline={false}
            aria-label={link.label}
            title={link.label}
          >
            <GitHubIcon />
          </SiteCardLink>
        ) : (
          <SiteLink
            key={`${link.href}:${link.label}`}
            href={link.href}
            target="_blank"
            size="small"
            className="press-external"
            data-header-control
            css={headerTextLinkStyles}
            appearance="text"
          >
            {link.label}
          </SiteLink>
        ),
      )}
    </div>
  )
  return icons ? (
    <ScrollArea
      label={text.navigation}
      orientation="horizontal"
      appearance="hidden"
      className="press-icon-links-scroll"
    >
      {content}
    </ScrollArea>
  ) : (
    content
  )
}

export function HeaderTextMenu({ site }: { site: PublicSite }) {
  const text = useMessages()
  const links = site.links.filter((link) => !link.icon)
  if (!links.length) return null
  return (
    <Menu
      className="press-drawer-text-links"
      label={text.navigation}
      size="medium"
      appearance="subtle"
    >
      {links.map((link) => (
        <SiteMenuItem
          key={`${link.href}:${link.label}`}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.label}
        </SiteMenuItem>
      ))}
    </Menu>
  )
}
