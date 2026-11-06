import { MenuDisclosure, MenuPopover, siteHeaderStyles } from "@yuzur1ha/ui"
import { useRef, useState } from "react"
import { SidebarMenu, type SidebarProps } from "./sidebar"
import { OutlinePanel, focusHeading, type OutlineHeading } from "./outline"
import { subheaderStyles } from "./subheader.styles"
import { useMessages } from "../context"
export function SiteSubheader({
  headings,
  ...sidebar
}: SidebarProps & { headings: OutlineHeading[] }) {
  const text = useMessages()
  const [navigationOpen, setNavigationOpen] = useState(false),
    [tocOpen, setTocOpen] = useState(false)
  const pending = useRef<string | undefined>(undefined)
  return (
    <div
      data-has-outline={headings.length > 0}
      className="press-subheader"
      data-site-header
      css={[siteHeaderStyles, subheaderStyles]}
    >
      <div className="press-subheader-inner">
        <MenuDisclosure
          className="press-directory-disclosure"
          contentClassName="press-directory-panel"
          label={text.docs}
          open={navigationOpen}
          onOpenChange={(open) => {
            setNavigationOpen(open)
            if (open) setTocOpen(false)
          }}
        >
          <SidebarMenu
            {...sidebar}
            onNavigate={() => setNavigationOpen(false)}
          />
        </MenuDisclosure>
        {headings.length > 0 && (
          <MenuPopover
            className="press-outline-popover"
            label={text.toc}
            open={tocOpen}
            onOpenChange={(open) => {
              setTocOpen(open)
              if (open) setNavigationOpen(false)
            }}
            onCloseAutoFocus={(event) => {
              if (pending.current) {
                event.preventDefault()
                focusHeading(pending.current)
                pending.current = undefined
              }
            }}
          >
            <OutlinePanel
              headings={headings}
              onSelect={(id) => {
                pending.current = id
                setTocOpen(false)
              }}
            />
          </MenuPopover>
        )}
      </div>
    </div>
  )
}
