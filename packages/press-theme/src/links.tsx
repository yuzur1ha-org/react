import {
  Link,
  MenuItem,
  type LinkProps,
  type LinkContainerProps,
  type MenuItemProps,
} from "@yuzur1ha/ui"
import { useHref, useLinkClickHandler } from "react-router"
function internal(href: string) {
  return href.startsWith("/") && !href.startsWith("//")
}
function RouterLink({ href, onClick, ...props }: LinkProps) {
  const target = useHref(href)
  const click = useLinkClickHandler<HTMLAnchorElement>(href, {
    ...(props.target ? { target: props.target } : {}),
  })
  return (
    <Link
      {...props}
      href={target}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) click(event)
      }}
    />
  )
}
export function SiteLink(props: LinkProps) {
  return internal(props.href) ? <RouterLink {...props} /> : <Link {...props} />
}

function RouterMenuItem({ href, onClick, ...props }: MenuItemProps) {
  const target = useHref(href)
  const click = useLinkClickHandler<HTMLAnchorElement>(href)
  return (
    <MenuItem
      {...props}
      href={target}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) click(event)
      }}
    />
  )
}
export function SiteMenuItem(props: MenuItemProps) {
  return internal(props.href) ? (
    <RouterMenuItem {...props} />
  ) : (
    <MenuItem {...props} />
  )
}

function RouterCardLink({ href, onClick, ...props }: LinkContainerProps) {
  const target = useHref(href),
    click = useLinkClickHandler<HTMLAnchorElement>(href, {
      ...(props.target ? { target: props.target } : {}),
    })
  return (
    <Link.Container
      {...props}
      href={target}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) click(event)
      }}
    />
  )
}
export function SiteCardLink(props: LinkContainerProps) {
  return internal(props.href) ? (
    <RouterCardLink {...props} />
  ) : (
    <Link.Container {...props} />
  )
}
