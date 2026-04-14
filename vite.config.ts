import { cloudflare } from "@cloudflare/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart({
      router: {
        quoteStyle: "double"
      }
    }),
    react(),
    tailwindcss()
  ],
  resolve: {
    tsconfigPaths: true
  },
  server: {
    port: 3000
  }
})
