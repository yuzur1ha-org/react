import type { AvatarProps } from "./avatar.types"
export type { AvatarProps } from "./avatar.types"
import { avatarStyles } from "./avatar.styles"
import { useState } from "react"

export function Avatar({
  name,
  src,
  size = "large",
  className = "",
  ...props
}: AvatarProps) {
  const [failedSource, setFailedSource] = useState<string>()
  const initials = name
    .trim()
    .split(/\s+/u)
    .slice(0, 2)
    .map((part) => Array.from(part)[0] ?? "")
    .join("")
    .toLocaleUpperCase()
  return (
    <span
      css={avatarStyles}
      {...props}
      className={`yu-avatar yu-avatar--${size} ${className}`}
      role="img"
      aria-label={name}
    >
      {src && failedSource !== src ? (
        <img key={src} src={src} onError={() => setFailedSource(src)} alt="" />
      ) : (
        initials
      )}
    </span>
  )
}
