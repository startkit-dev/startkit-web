import { cloudflare } from "@cloudflare/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite-plus"

export default defineConfig({
  staged: {
    "*": "vp check --fix"
  },
  fmt: {
    semi: false,
    singleQuote: false,
    trailingComma: "none",
    tabWidth: 2,
    printWidth: 80,
    proseWrap: "always",
    sortImports: {},
    sortPackageJson: true,
    sortTsconfig: true,
    sortTailwindConfig: true,
    ignorePatterns: ["**/*.d.ts", "**/*.gen.ts"]
  },
  lint: {
    plugins: [
      "eslint",
      "import",
      "jsdoc",
      "node",
      "oxc",
      "promise",
      "react",
      "react-perf",
      "typescript",
      "unicorn",
      "vitest"
    ],
    categories: {
      correctness: "error",
      perf: "warn",
      suspicious: "warn",
      pedantic: "off"
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react-perf/jsx-no-jsx-as-prop": "off",
      "typescript/no-explicit-any": "error",
      "typescript/no-misused-promises": "warn"
    },
    options: {
      typeAware: true,
      typeCheck: true
    },
    overrides: [
      {
        files: ["**/*.test.ts"],
        rules: {
          "typescript/no-explicit-any": "off"
        }
      },
      {
        files: ["**/*.d.ts"],
        rules: {
          "import/no-unassigned-import": "off"
        }
      }
    ]
  },
  resolve: {
    tsconfigPaths: true
  },
  server: {
    port: 3000
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart({
      router: {
        quoteStyle: "double"
      }
    }),
    react(),
    tailwindcss()
  ]
})
