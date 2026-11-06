import { defineConfig } from "@yuzur1ha/press"
import { compileDocument } from "@yuzur1ha/markdown/compiler"
import {
  consumeTitle,
  readMetadata,
  metadataString,
  staticHtml,
} from "@yuzur1ha/markdown/plugins"
export default defineConfig({
  content: { srcDir: "content" },
  site: {
    title: "Fixture",
    locales: [
      { id: "en", lang: "en", label: "English", sourceDir: "", prefix: "" },
    ],
    sections: [],
  },
  plugins: [
    {
      name: "fixture:content",
      setup(_context) {
        return {
          content: {
            test: () => true,
            async compile(source, path) {
              const compiled = await compileDocument(source, path, {
                html: staticHtml,
                analyze(tree, context) {
                  return readMetadata(
                    context,
                    {
                      id: metadataString,
                      title: metadataString,
                      locale: metadataString,
                    },
                    { title: consumeTitle(tree) },
                  )
                },
              })
              const id = compiled.metadata.id
              if (typeof id !== "string") throw new Error("Missing id")
              return {
                source: path,
                id,
                key:
                  typeof compiled.metadata.locale === "string"
                    ? `${compiled.metadata.locale}/${id}`
                    : id,
                ...(typeof compiled.metadata.locale === "string"
                  ? { locale: compiled.metadata.locale }
                  : {}),
                metadata: compiled.metadata,
                compiled,
              }
            },
          },
        }
      },
    },
  ],
})
