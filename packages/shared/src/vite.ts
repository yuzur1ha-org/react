import { isBuiltin } from "node:module"
import { defineConfig, type UserConfig } from "vite"
export interface LibraryConfigOptions {
  root: string
  entry: Record<string, string>
  target: string
  manifest: {
    dependencies?: Record<string, string>
    peerDependencies?: Record<string, string>
    optionalDependencies?: Record<string, string>
  }
}

export function libraryConfig({
  root,
  entry,
  target,
  manifest,
}: LibraryConfigOptions): UserConfig {
  const dependencies = Object.keys({
    ...manifest.dependencies,
    ...manifest.peerDependencies,
    ...manifest.optionalDependencies,
  })
  return defineConfig({
    root,
    build: {
      target,
      minify: false,
      sourcemap: true,
      lib: {
        entry,
        formats: ["es"],
        fileName: (_format, name) => `${name}.js`,
      },
      rolldownOptions: {
        external: (id) =>
          isBuiltin(id) ||
          dependencies.some((name) => id === name || id.startsWith(`${name}/`)),
        output: { chunkFileNames: "chunks/[name]-[hash].js" },
      },
    },
  })
}
