/** @jsxImportSource @emotion/react */
import { Button, Link, useTokens } from "@yuzur1ha/ui"
import { Frame, ArrowUpRight } from "lucide-react"
import { useState } from "react"
import { componentDesignUrl } from "./links"
import { designUrl, designEmbed } from "./model"
import { FigmaPreviewLoading } from "./preview-loading"
import { figmaPreviewStyles } from "./preview.styles"
export function FigmaPreview({
  url,
  title,
  description,
}: {
  url: string
  title: string
  description?: string
}) {
  const href = designUrl(
    componentDesignUrl(url, import.meta.env.VITE_FIGMA_FILE_URL),
  )
  const theme = useTokens()["color-scheme"] === "dark" ? "dark" : "light"
  const [open, setOpen] = useState(false)
  return (
    <section
      className="figma-preview"
      aria-label={title}
      css={figmaPreviewStyles}
    >
      <header>
        <span className="figma-preview-eyebrow">
          <Frame size={16} aria-hidden="true" />
          Design source
        </span>
        <Link href={href} target="_blank" size="small">
          Open in Figma
        </Link>
      </header>
      {open ? (
        <DesignFrame key={theme} title={title} src={designEmbed(href, theme)} />
      ) : (
        <div className="figma-preview-cover">
          <div>
            <h3>{title}</h3>
            {description && <p>{description}</p>}
          </div>
          <Button
            appearance="secondary"
            size="small"
            onClick={() => setOpen(true)}
          >
            Load preview
            <ArrowUpRight size={14} aria-hidden="true" />
          </Button>
        </div>
      )}
      {open && (
        <footer>
          <span>Figma sharing permissions apply.</span>
          <Button
            appearance="text"
            size="small"
            onClick={() => {
              setOpen(false)
            }}
          >
            Close preview
          </Button>
        </footer>
      )}
    </section>
  )
}

function DesignFrame({ title, src }: { title: string; src: string }) {
  const [loaded, setLoaded] = useState(false),
    [failed, setFailed] = useState(false)
  return (
    <div className="figma-preview-frame">
      {!loaded && !failed && <FigmaPreviewLoading />}
      {failed ? (
        <div role="alert">
          <p>Preview unavailable. Open the design in Figma or try again.</p>
          <Button
            appearance="text"
            size="small"
            onClick={() => {
              setLoaded(false)
              setFailed(false)
            }}
          >
            Retry preview
          </Button>
        </div>
      ) : (
        <iframe
          title={title}
          src={src}
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
