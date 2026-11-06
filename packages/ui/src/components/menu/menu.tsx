import type {
  MenuProps,
  MenuGroupProps,
  MenuItemProps,
  MenuActionProps,
} from "./menu.types"
export type {
  MenuProps,
  MenuGroupProps,
  MenuItemProps,
  MenuActionProps,
} from "./menu.types"

import { linkRel } from "../../internal/link-rel"
import { useId, useContext } from "react"
import { ArrowUpRight } from "lucide-react"
import { menuStyles, menuItemStyles } from "./menu.styles"
import { MenuActiveStyle, DismissMenu } from "./menu-context"

export function Menu({
  label,
  appearance = "default",
  activeAppearance = "subtle",
  orientation = "vertical",
  size = "medium",
  groupGap,
  className = "",
  ...props
}: MenuProps) {
  return (
    <MenuActiveStyle.Provider value={activeAppearance}>
      <nav
        {...props}
        aria-label={label}
        data-appearance={appearance}
        data-active-appearance={activeAppearance}
        data-orientation={orientation}
        data-size={size}
        data-group-gap={groupGap !== undefined || undefined}
        css={[
          menuStyles,
          groupGap === undefined
            ? undefined
            : { "--yu-menu-group-gap": `${groupGap}px` },
        ]}
        className={`yu-menu ${className}`}
      />
    </MenuActiveStyle.Provider>
  )
}

export function MenuGroup({
  label,
  children,
  className = "",
  ...props
}: MenuGroupProps) {
  const id = useId()
  return (
    <div
      {...props}
      role="group"
      aria-labelledby={label.trim() ? id : undefined}
      className={`yu-menu-group ${className}`}
    >
      {label.trim() && (
        <p id={id} className="yu-menu-label">
          {label}
        </p>
      )}
      {children}
    </div>
  )
}

export function MenuItem({
  active,
  activeAppearance,
  dismissOnSelect = true,
  disabled,
  icon,
  trailing,
  children,
  className = "",
  onClick,
  href,
  ...props
}: MenuItemProps) {
  const inheritedActiveAppearance = useContext(MenuActiveStyle)
  const dismiss = useContext(DismissMenu)
  return (
    <a
      {...props}
      href={disabled ? undefined : href}
      rel={linkRel(props.target, props.rel)}
      css={menuItemStyles}
      className={`yu-menu-item ${className}`}
      role={disabled ? "link" : props.role}
      data-active-appearance={activeAppearance ?? inheritedActiveAppearance}
      aria-current={active ? (props["aria-current"] ?? "page") : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : props.tabIndex}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault()
          return
        }
        onClick?.(event)
        if (
          dismissOnSelect &&
          event.button === 0 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey
        )
          dismiss("link")
      }}
    >
      {icon && (
        <span className="yu-menu-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="yu-menu-text">{children}</span>
      {trailing && <span className="yu-menu-trailing">{trailing}</span>}
      {props.target === "_blank" && (
        <ArrowUpRight size={14} aria-hidden="true" />
      )}
    </a>
  )
}

export function MenuAction({
  className = "",
  onClick,
  dismissOnSelect = true,
  ...props
}: MenuActionProps) {
  const dismiss = useContext(DismissMenu)
  return (
    <button
      type="button"
      {...props}
      onClick={(event) => {
        onClick?.(event)
        if (dismissOnSelect && !event.defaultPrevented) dismiss("action")
      }}
      css={menuItemStyles}
      className={`yu-menu-item ${className}`}
    />
  )
}
