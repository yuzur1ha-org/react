import { dialogOverlayStyles } from "../../internal/dialog-overlay.styles"
import type { ModalProps } from "./modal.types"
export type { ModalProps } from "./modal.types"
import { modalStyles } from "./modal.styles"
import * as Dialog from "@radix-ui/react-dialog"
import { useRef, useState } from "react"
import { CloseButton } from "../close-button/index"

export function Modal({
  trigger,
  title,
  description,
  children,
  closeLabel,
  open,
  onOpenChange,
  defaultOpen = false,
  className = "",
}: ModalProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const contentRef = useRef<HTMLDivElement>(null)
  return (
    <Dialog.Root
      open={open ?? internalOpen}
      onOpenChange={(next) => {
        if (open === undefined) setInternalOpen(next)
        onOpenChange?.(next)
      }}
    >
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          css={dialogOverlayStyles}
          className="yu-modal-overlay"
        />
        <Dialog.Content
          css={modalStyles}
          ref={contentRef}
          className={`yu-modal ${className}`}
          onPointerDownOutside={(event) => event.preventDefault()}
          onOpenAutoFocus={(event) => {
            const target = contentRef.current?.querySelector<HTMLElement>(
              "input:not([type=hidden]):not(:disabled), textarea:not(:disabled), select:not(:disabled), .yu-modal-actions button:not(:disabled)",
            )
            if (target) {
              event.preventDefault()
              target.focus()
            }
          }}
        >
          <div className="yu-modal-header">
            <div className="yu-modal-heading">
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.Close asChild>
                <CloseButton label={closeLabel} />
              </Dialog.Close>
            </div>
            <Dialog.Description>{description}</Dialog.Description>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
export const ModalClose = Dialog.Close
