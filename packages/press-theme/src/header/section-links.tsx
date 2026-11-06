import { sectionDocuments } from "@yuzur1ha/press/content"
import type { HeaderProps } from "./header"
import { SiteMenuItem } from "../links"
export function SectionLinks({
  site,
  locale,
  section,
}: Pick<HeaderProps, "site" | "locale" | "section">) {
  return (
    <>
      {site.sections.map((item) => {
        const target = sectionDocuments(site, item, locale?.id ?? "")[0]
        return target ? (
          <SiteMenuItem
            key={item.id}
            href={target.route}
            active={section?.id === item.id}
          >
            {item.label}
          </SiteMenuItem>
        ) : null
      })}
    </>
  )
}
