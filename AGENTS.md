# CRITICAL — Read first

- Use `bun` for everything: install, scripts, and running tests (`bun test`).
  Reason: the project is bun-native; using npm/pnpm/yarn produces a broken
  lockfile.
- UI follows the shadcn/ui pattern (components copied into `src/components/ui/`)
  but the primitive layer underneath is `@base-ui/react`, not radix-ui. Reason:
  the project migrated off radix in commit `ca84134`. When adding or updating a
  component, import primitives from `@base-ui/react` — never from `@radix-ui/*`.
- Never hand-edit generated files: `src/routeTree.gen.ts`,
  `src/db/types.gen.ts`, `worker-configuration.d.ts`. Regenerate with
  `bun run typegen` after schema or route changes.

## Commands

```bash
bun dev                  # dev server on :3000
bun run check            # format:check + lint + test (lint includes typecheck)
bun run fix              # auto-fix format + lint
bun test                 # bun's built-in test runner
bun run db:migrate       # apply D1 migrations (local)
bun run db:migrate:prod  # apply D1 migrations (production)
bun run typegen          # regenerate worker + Kysely types
```

## Stack conventions

- **Framework.** TanStack Start (Router + Query + Vite) deployed to Cloudflare
  Workers. Not Next.js — do not reach for Next.js APIs (`next/*`, App Router
  primitives, etc.).
- **Routing.** File-based under `src/routes/`. Layout routes use `_main.tsx` /
  `_auth.tsx` prefixes. API routes live under `src/routes/api/`. The route tree
  is generated into `src/routeTree.gen.ts` at dev/build.
- **Database.** Kysely on Cloudflare D1 via `kysely-d1`'s `D1Dialect` with
  `CamelCasePlugin` registered. Write TypeScript in camelCase; SQL columns stay
  snake_case — the plugin maps between them. Get a client from `getDb()` in
  `src/db/client.ts`, which reads `env.DB` from `cloudflare:workers`.
- **Migrations.** Hand-written SQL in `migrations/`. After adding or editing a
  migration, run `bun run db:types` (or `bun run typegen`) to refresh
  `src/db/types.gen.ts`. Types are derived by replaying migrations into a
  scratch Bun SQLite DB via `kysely-codegen` — there is no live-DB introspection
  step.
- **Auth.** Better-Auth with GitHub OAuth, using its built-in Kysely D1 adapter
  (pass `env.DB` directly). Server config in `src/lib/auth.ts`, client in
  `src/lib/auth-client.ts`, routes mounted at `src/routes/api/auth/$.ts`.
- **Env vars.** Validated in `src/env.ts` with Valibot. Add new variables to
  that schema — do not read `process.env` directly elsewhere in the app.
- **Styling.** Tailwind CSS 4 via `@tailwindcss/vite`. Global styles in
  `src/styles/`.
- **Imports.** Use the `@/` alias for `src/`; avoid relative paths across module
  boundaries.
- **Lint / format.** `oxlint` and `oxfmt` (OXC toolchain). `oxlint` runs
  typechecking via `oxlint-tsgolint`, so there is no separate `tsc` step — don't
  add a `typecheck` script or reach for `tsc --noEmit`. Do not introduce ESLint
  or Prettier.

# CRITICAL — Read last

- Use `bun`, not `npm`/`pnpm`/`yarn`. `bun test` is the test runner — there is
  no vitest or jest.
- UI uses the shadcn/ui pattern with `@base-ui/react` primitives — never import
  from `@radix-ui/*`.
- Never edit generated files (`routeTree.gen.ts`, `db/types.gen.ts`,
  `worker-configuration.d.ts`) — regenerate with `bun run typegen`.
