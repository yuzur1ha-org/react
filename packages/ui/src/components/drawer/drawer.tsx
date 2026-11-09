import { dialogOverlayStyles } from "../../internal/dialog-overlay.styles"
import type { DrawerProps } from "./drawer.types"
export type { DrawerProps } from "./drawer.types"
import * as Dialog from "@radix-ui/react-dialog"

import { CloseButton } from "../close-button/index"
import { drawerStyles } from "./drawer.styles"

export function Drawer({
  trigger,
  title,
  description,
  closeLabel,
  side = "right",
  open,
  defaultOpen,
  onOpenChange,
  children,
  footer,
  headerActions,
  headerContent,
  bodyClassName = "",
  className = "",
  ...props
}: DrawerProps) {
  const close = (
    <Dialog.Close asChild>
      <CloseButton label={closeLabel} />
    </Dialog.Close>
  )
  return (
    <Dialog.Root {...{ open, defaultOpen, onOpenChange }}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          css={dialogOverlayStyles}
          className="yu-drawer-overlay"
        />
        <Dialog.Content
          {...props}
          css={drawerStyles}
          className={`yu-drawer ${className}`}
          data-side={side}
          {...(!description ? { "aria-describedby": undefined } : {})}
        >
          <header className="yu-drawer-header">
            <div className="yu-drawer-heading">
              <Dialog.Title>{title}</Dialog.Title>
              {headerActions ? (
                <div className="yu-drawer-header-actions">
                  {headerActions}
                  {close}
                </div>
              ) : (
                close
              )}
            </div>
            {headerContent}
            {description && (
              <Dialog.Description>{description}</Dialog.Description>
            )}
          </header>
          <div className={`yu-drawer-body ${bodyClassName}`}>{children}</div>
          {footer && <footer className="yu-drawer-footer">{footer}</footer>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
export const DrawerClose = Dialog.Close
