import { useEffect, useState } from "react"
import { useLocation } from "react-router"
import {
  Button,
  Drawer,
  Menu,
  MenuGroup,
  ScrollArea,
  useViewportLayout,
} from "@yuzur1ha/ui"
import { Menu as MenuIcon } from "lucide-react"
import { useMessages } from "../context"
import type { HeaderProps } from "./header"
import { HeaderControls } from "./header-controls"
import { HeaderLinks, HeaderTextMenu } from "./header-links"
import { SiteMenuItem } from "../links"
import { SectionLinks } from "./section-links"
import { drawerStyles } from "./header-drawer.styles"

export function HeaderDrawer(props: HeaderProps) {
  const { site, locale, section, home } = props
  const text = useMessages()
  const location = useLocation()
  const layout = useViewportLayout()
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [location.pathname])
  useEffect(() => {
    if (layout !== "phone") setOpen(false)
  }, [layout])
  return (
    <div className="press-phone-navigation">
      <Drawer
        key={locale?.id}
        open={open}
        onOpenChange={setOpen}
        title={text.navigation}
        closeLabel={text.close}
        side="right"
        css={drawerStyles}
        trigger={
          <Button appearance="text" size="small" aria-label={text.navigation}>
            <MenuIcon size={22} aria-hidden="true" />
          </Button>
        }
      >
        <ScrollArea
          appearance="hidden"
          className="press-drawer-scroll"
          label={text.navigation}
          overscrollBehavior="contain"
        >
          <div className="press-drawer-content">
            <Menu
              className="press-drawer-navigation"
              appearance="subtle"
              activeAppearance="subtle"
              size="medium"
              groupGap={24}
              label={text.navigation}
            >
              <MenuGroup label={text.overview}>
                <SiteMenuItem href={home} active={location.pathname === home}>
                  {text.home}
                </SiteMenuItem>
              </MenuGroup>
              <MenuGroup label={text.docs}>
                <SectionLinks
                  site={site}
                  {...(locale ? { locale } : {})}
                  {...(section ? { section } : {})}
                />
              </MenuGroup>
            </Menu>
            <HeaderTextMenu site={site} />
            <div className="press-drawer-settings">
              <HeaderLinks site={site} icons />
              <HeaderControls {...props} settings />
            </div>
          </div>
        </ScrollArea>
      </Drawer>
    </div>
  )
}
