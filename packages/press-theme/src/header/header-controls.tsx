import { Select, Switch, useViewportLayout } from "@yuzur1ha/ui"
import { Moon, Sun } from "lucide-react"
import { useLocation, useNavigate } from "react-router"
import { translatedDocument } from "@yuzur1ha/press/content"
import type { HeaderProps } from "./header"
import { useMessages } from "../context"
export function HeaderControls({
  site,
  locale,
  document,
  dark,
  setDark,
  settings = false,
}: Pick<HeaderProps, "site" | "locale" | "document" | "dark" | "setDark"> & {
  settings?: boolean
}) {
  const layout = useViewportLayout()
  const compact = settings || layout !== "desktop"
  const text = useMessages(),
    navigate = useNavigate(),
    location = useLocation()
  return (
    <div className="press-controls">
      {" "}
      {site.locales.length > 1 && (
        <div className="press-language-setting yu-header-locale">
          {settings && <span aria-hidden="true">{text.language}</span>}
          <Select
            key={locale?.id}
            label={text.language}
            hideLabel
            font="mono"
            appearance="text"
            value={locale?.id ?? ""}
            size="small"
            options={site.locales.map((item) => ({
              value: item.id,
              label: compact ? (item.shortLabel ?? item.label) : item.label,
            }))}
            onValueChange={(id) => {
              const target = document
                ? translatedDocument(site, document, id)
                : undefined
              const fallback =
                site.homes.find((item) => item.locale === id) ??
                site.documents.find((item) => item.locale === id)
              const hash = target?.metadata.toc?.some(
                (item) => `#${encodeURIComponent(item.id)}` === location.hash,
              )
                ? location.hash
                : ""
              void navigate(
                target
                  ? target.route + hash
                  : fallback
                    ? fallback.route + (document ? "?translation=missing" : "")
                    : "/404/",
              )
            }}
          />
        </div>
      )}
      <div className="press-theme-setting">
        {settings && <span>{text.theme}</span>}{" "}
        <div className="press-theme-control">
          <Switch
            label={text.theme}
            hideLabel
            size="large"
            checked={dark}
            checkedIcon={<Moon size={14} />}
            uncheckedIcon={<Sun size={14} />}
            onChange={(event) => setDark(event.target.checked)}
          />
        </div>
      </div>
    </div>
  )
}
