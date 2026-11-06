import type { CodeBlockViewProps } from "./code-block"
import type { ComponentType, ReactNode } from "react"
import type { PublicSite, SiteDocument, SiteHome } from "../content"
export type DocumentRendererProps<Metadata = unknown> = {
  metadata: Metadata
  Content: ComponentType
}
export type DocumentRenderer<Metadata = unknown> = {
  Document: ComponentType<DocumentRendererProps<Metadata>>
}
export function defineDocument<Metadata>(renderer: DocumentRenderer<Metadata>) {
  return renderer
}
export type ThemeModule = {
  CodeBlockView?: ComponentType<CodeBlockViewProps>
  SiteRoot: ComponentType<{
    site: PublicSite
    children?: ReactNode
    error?: ReactNode
  }>
  DocumentPage: ComponentType<{ document: SiteDocument; children: ReactNode }>
  SiteHomePage: ComponentType<{ home: SiteHome; children?: ReactNode }>
  DocumentFailure: ComponentType
  DocumentBoundary: ComponentType<{ children: ReactNode }>
  DocumentLoading: ComponentType
  NotFound: ComponentType
}
