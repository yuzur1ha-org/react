import { createContext, type Dispatch, type SetStateAction } from "react"
import { css } from "@emotion/react"
import { Menu, MenuItem, ScrollArea } from "@yuzur1ha/ui"
import { navigateHash } from "./hash-navigation"
import { useActiveHeading } from "./use-active-heading"
import { useMessages } from "../context"
export type OutlineHeading = { id: string; title: string; level?: number }
export type OutlineState = { documentKey: string; headings: OutlineHeading[] }
export const OutlineContext = createContext<
  Dispatch<SetStateAction<OutlineState | undefined>> | undefined
>(undefined)
export function focusHeading(id: string) {
  navigateHash(`#${encodeURIComponent(id)}`)
}
export function OutlineMenu({
  headings,
  onSelect,
}: {
  headings: OutlineHeading[]
  onSelect?: (id: string) => void
}) {
  const text = useMessages()
  const active = useActiveHeading(headings)
  return (
    <Menu
      label={text.toc}
      size="small"
      appearance="subtle"
      activeAppearance="emphasis"
    >
      {headings.map((item) => (
        <MenuItem
          key={item.id}
          href={`#${encodeURIComponent(item.id)}`}
          active={active === item.id}
          aria-current={active === item.id ? "location" : undefined}
          className={item.level === 3 ? "press-toc-nested" : ""}
          onClick={() => onSelect?.(item.id)}
        >
          {item.title}
        </MenuItem>
      ))}
    </Menu>
  )
}

export function OutlinePanel(props: Parameters<typeof OutlineMenu>[0]) {
  const text = useMessages()
  return (
    <ScrollArea
      label={text.toc}
      appearance="normal"
      className="press-outline-scroll"
      overscrollBehavior="contain"
      css={css`
        max-height: inherit;
        min-height: 0;
        nav {
          padding: 16px 20px;
        }
      `}
    >
      <OutlineMenu {...props} />
    </ScrollArea>
  )
}
export const outlinePopoverStyles = css`
  .press-outline-popover.press-outline-popover {
    padding: 0;
    overflow: hidden;
    gap: 0;
    max-height: min(60svh, var(--radix-popover-content-available-height));
  }
`
