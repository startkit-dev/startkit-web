# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

This is a TanStack Start application with React, using Bun as the package
manager. The project is configured for Cloudflare Workers deployment and
includes a comprehensive modern toolchain.

**Key Technologies:**

- TanStack Start (full-stack React framework)
- TanStack Query for data fetching
- TanStack Router for file-based routing
- React 19 with React OXC compiler
- Tailwind CSS 4 with shadcn/ui components
- Rolldown-powered Vite for build tooling
- Bun for package management
- TypeScript with strict configuration
- Better-Auth for authentication with GitHub OAuth
- Drizzle ORM with Cloudflare D1 SQLite database
- Valibot for environment variable validation

## Common Commands

**Development:**

```bash
bun dev                 # Start development server on port 3000
bun start               # Start production server
```

**Code Quality:**

```bash
bun run check           # Run all checks (format, lint, typecheck, tests)
bun run fix             # Auto-fix formatting and linting issues
bun run format          # Format code with oxfmt
bun run format:check    # Check code formatting
bun run lint            # Lint code with oxlint
bun run lint:fix        # Auto-fix linting issues
bun run typecheck       # Run TypeScript type checking
bun test                # Run the test suite
```

**Database:**

```bash
bun run db:generate     # Generate database schema migrations
bun run db:migrate      # Apply database migrations (local)
bun run db:migrate:prod # Apply database migrations (production)
bun run db:reset        # Reset database (clean + migrate)
bun run db:studio       # Open Drizzle Studio GUI
```

**Build & Deployment:**

```bash
bun run build           # Build for production
bun run clean           # Clean cache directories
bun run nuke            # Clean everything including node_modules
```

**Setup & Utilities:**

```bash
bun run setup           # Initial project setup (install, env, migrate)
bun run outdated        # Check for package updates interactively
bun run typegen         # Generate Cloudflare Worker types
```

## Architecture

**Router Configuration:**

- File-based routing with `src/routes/` directory
- Route tree auto-generated in `src/routeTree.gen.ts`
- Root route in `src/routes/__root.tsx` includes global providers and error
  boundaries
- Router configured with TanStack Query integration in `src/router.tsx`

**Component Organization:**

- `src/components/ui/` - shadcn/ui components
- `src/components/layout/` - Layout components (header, footer)
- `src/components/themes/` - Theme provider and picker
- `src/components/errors/` - Error boundaries and not found pages
- `src/components/dev/` - Development-only components (devtools, indicators)

**Database & Authentication:**

- `src/db/` - Database configuration and schemas
  - `src/db/client.ts` - Drizzle database client for Cloudflare D1
  - `src/db/schema.ts` - Database schema definitions
  - `src/db/schemas/auth-schema.ts` - Better-Auth schema tables
- `src/lib/auth.ts` - Better-Auth server configuration
- `src/lib/auth-client.ts` - Better-Auth client utilities
- `src/env.ts` - Environment variable validation with Valibot
- `drizzle.config.ts` - Drizzle Kit configuration for Cloudflare D1
- `wrangler.jsonc` - Cloudflare Workers configuration with D1 binding

**Configuration:**

- `src/config/site-config.ts` - Site-wide configuration
- `src/lib/` - Utility functions, API functions, and shared logic
- `src/styles/` - Global CSS including Tailwind base styles

**Key Patterns:**

- Uses `@/` path alias for src directory
- TanStack Query client integrated into router context
- Theme system with system/light/dark mode support
- Font preloading with Geist variable fonts
- API routes in `src/routes/api/` directory
- Better-Auth integration with GitHub OAuth provider
- Drizzle ORM with Cloudflare D1 SQLite database
- Cloudflare Workers deployment target with D1 binding
- Valibot schema validation for type-safe environment variables
- Layout routes (`_main.tsx`, `_auth.tsx`) for route grouping

## Development Notes

**Vite Configuration:**

- Target: Cloudflare Module Workers
- Default port: 3000
- Uses Rolldown-powered Vite with React OXC plugin for faster compilation
- Includes TypeScript path mapping support
- Tailwind CSS 4 integration via `@tailwindcss/vite`
- Cloudflare plugin for SSR environment

**Database Configuration:**

- Drizzle ORM with Cloudflare D1 dialect
- Migrations stored in `drizzle/migrations/`
- D1 HTTP driver for remote database access
- Local development uses Wrangler's local D1 database
- Database binding configured as `DB` in `wrangler.jsonc`

**Authentication Setup:**

- Better-Auth with GitHub OAuth provider
- Environment variables: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`,
  `OAUTH_GITHUB_CLIENT_ID`, `OAUTH_GITHUB_CLIENT_SECRET`
- Auto-generated secret via `dotkit` during setup
- API routes handle auth at `src/routes/api/auth/$.ts`

**Linting & Formatting:**

- OxLint for fast linting (configured in `.oxlintrc.json`)
- OxFmt for code formatting (configured in `.oxfmtrc.jsonc`)
- Both powered by the OXC toolchain for speed

**Package Manager:**

- Uses Bun for all operations
- Lock file: `bun.lock`
- TypeScript and React 19 compatible
- Setup script at `bin/setup` handles initial configuration
