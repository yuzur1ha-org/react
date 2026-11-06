import type {
  MenuSurfaceProps,
  MenuDisclosureProps,
  MenuPopoverProps,
} from "./menu-surfaces.types"
export type {
  MenuSurfaceProps,
  MenuDisclosureProps,
  MenuPopoverProps,
} from "./menu-surfaces.types"
import { useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "../button/index"
import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
} from "../disclosure/index"
import { ScrollArea } from "../scroll-area/index"
import { Popover } from "../popover/index"
import { DismissMenu } from "./menu-context"
import { menuDisclosureStyles } from "./menu.styles"

function useMenuOpen({
  open,
  defaultOpen = false,
  onOpenChange,
}: MenuSurfaceProps) {
  const [internal, setInternal] = useState(defaultOpen)
  return [
    open ?? internal,
    (next: boolean) => {
      if (open === undefined) setInternal(next)
      onOpenChange?.(next)
    },
  ] as const
}
export function MenuDisclosure(props: MenuDisclosureProps) {
  const {
    label,
    children,
    className = "",
    contentClassName = "",
    scrollContentClassName = "",
    size = "small",
  } = props
  const [open, setOpen] = useMenuOpen(props)
  const trigger = useRef<HTMLButtonElement>(null)
  return (
    <Disclosure
      open={open}
      onOpenChange={setOpen}
      css={menuDisclosureStyles}
      data-size={size}
      className={`yu-menu-disclosure ${className}`}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault()
          setOpen(false)
          trigger.current?.focus()
        }
      }}
    >
      <DisclosureTrigger ref={trigger} headingLevel={2}>
        {label}
      </DisclosureTrigger>
      <DisclosureContent
        className={`yu-menu-disclosure-content ${contentClassName}`}
      >
        <ScrollArea
          label={label}
          overscrollBehavior="contain"
          className="yu-menu-scroll"
          contentClassName={`yu-menu-scroll-content ${scrollContentClassName}`}
          viewportProps={{ tabIndex: -1 }}
        >
          <DismissMenu.Provider
            value={(reason) => {
              setOpen(false)
              if (reason === "action") trigger.current?.focus()
            }}
          >
            {children}
          </DismissMenu.Provider>
        </ScrollArea>
      </DisclosureContent>
    </Disclosure>
  )
}
export function MenuPopover(props: MenuPopoverProps) {
  const {
    label,
    children,
    className = "",
    size = "small",
    triggerAppearance = "text",
    onCloseAutoFocus,
  } = props
  const [open, setOpen] = useMenuOpen(props)
  return (
    <Popover
      label={label}
      onCloseAutoFocus={onCloseAutoFocus}
      open={open}
      onOpenChange={setOpen}
      align="end"
      showArrow={false}
      className={`yu-menu-popover ${className}`}
      trigger={
        <Button size={size} appearance={triggerAppearance}>
          {label}
          <ChevronDown size={14} aria-hidden="true" />
        </Button>
      }
    >
      <DismissMenu.Provider value={() => setOpen(false)}>
        {children}
      </DismissMenu.Provider>
    </Popover>
  )
}
