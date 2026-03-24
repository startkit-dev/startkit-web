# StartKit: Tanstack Start

> A sane way to start your next Tanstack Start app

## Features

- The latest [**Tanstack Start**](https://tanstack.com/start) with React and
  first-class [Tanstack Query](https://tanstack.com/query) support.
- [Tailwind CSS 4](https://tailwindcss.com) and
  [shadcn/ui](https://ui.shadcn.com) preinstalled.
- [Better-Auth](https://better-auth.com) authentication with GitHub OAuth
  provider
- [Drizzle ORM](https://orm.drizzle.team) configured for **Cloudflare D1**.
- [Valibot](https://valibot.dev) for type-safe enforcement.
- [Vite+](https://viteplus.dev) with Vite 8, oxlint, oxfmt, and vitest.
- Automatic CI with Github Actions
- Pre-configured for [Cloudflare Workers](https://cloudflare.com) deployment

## Getting Started

To get started, simply clone the repository and run `pnpm run setup`:

1. Clone the project or
   [use the template](https://github.com/new?template_owner=startkit-dev&template_name=startkit)

```sh
npx gitpick startkit-dev/startkit my-app
cd my-app
```

2. Run the setup script

```sh
pnpm run setup
```

This script (located in `./bin/setup`) will install the dependencies, set up
your local .env file, and migrate the database.

## Development

Start the development server:

```sh
pnpm dev
```

## Code Quality

Run all quality checks (formatting, linting, and type checking):

```sh
pnpm run check
```

Auto-fix formatting and linting issues:

```sh
pnpm run fix
```

Individual commands:

```sh
pnpm run format          # Format code with oxfmt
pnpm run format:check    # Check formatting without fixing
pnpm run lint            # Lint code with oxlint
pnpm run lint:fix        # Auto-fix linting issues
pnpm run typecheck       # Run TypeScript type checking
pnpm test                # Run the test suite
```

## Database

This project uses [Drizzle ORM](https://orm.drizzle.team) configured for
[Cloudflare D1](https://developers.cloudflare.com/d1/) by default, but can be
swapped to any database of your choosing.

### Database commands:

```sh
pnpm run db:generate     # Generate database schema migrations
pnpm run db:migrate      # Apply database migrations (locally)
pnpm run db:reset        # Reset database (clean + migrate)
pnpm run db:studio       # Open Drizzle Studio GUI
```

### Setting up the database

To create a new D1 database in production, run:

```sh
pnpm exec wrangler d1 create "startkit-db"
```

## Authentication

Authentication is handled by [Better-Auth](https://better-auth.com) with:

- GitHub OAuth provider pre-configured
- User, session, account, and verification tables
- Drizzle adapter integration
- Type-safe environment configuration

## Build

Build for production:

```sh
pnpm run build
```

## Deployment

This project is pre-configured for automatic deployment to Cloudflare Workers
with unique preview URLs for each pull request.

📖 **[See detailed deployment guide →](docs/deploy.md)**

## Utilities

```sh
pnpm run clean           # Clean cache directories
pnpm run nuke            # Clean everything including node_modules
pnpm run outdated        # Check for package updates interactively
```
