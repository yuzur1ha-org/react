import { createContext, useContext } from "react"
import { englishMessages, type PublicSite } from "../content/index"
export const SiteContext = createContext<PublicSite | undefined>(undefined)
export const MessagesContext = createContext(englishMessages)
export function useSite() {
  const site = useContext(SiteContext)
  if (!site) throw new Error("Missing Press site context")
  return site
}
export function localeForPath(site: PublicSite, pathname: string) {
  const route = decodeURI(pathname)
  const id =
    site.documents.find((item) => decodeURI(item.route) === route)?.locale ??
    site.homes.find((item) => decodeURI(item.route) === route)?.locale
  return (
    site.locales.find((item) => item.id === id) ??
    [...site.locales]
      .sort((a, b) => b.prefix.length - a.prefix.length)
      .find(
        (item) =>
          !item.prefix ||
          route === `/${item.prefix}` ||
          route.startsWith(`/${item.prefix}/`),
      ) ??
    site.locales[0]
  )
}
export const useMessages = () => useContext(MessagesContext)
