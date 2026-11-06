declare module "*.md" {
  const Content: import("react").ComponentType<
    import("./component-props").MarkdownComponentProps
  >
  export default Content
}
