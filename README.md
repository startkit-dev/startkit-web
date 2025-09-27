# StartKit: Tanstack Start

> A sane way to start your next Tanstack Start app

## Features

- ✅ The latest [**Tanstack Start**](https://tanstack.com/start) with react and first-class [Tanstack Query](https://tanstack.com/query) support.
- ✅ [Tailwind CSS 4](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com) preinstalled.
- ✅ [Better-Auth](https://better-auth.com) authentication with GitHub OAuth provider
- ✅ [Drizzle ORM](https://orm.drizzle.team) configured for **Cloudflare D1**.
- ✅ [Valibot](https://valibot.dev) for type-safe enforcement.
- ✅ Type-aware linting with shared Eslint 9 configs
- ✅ Supercharged **Prettier** (with [`@prettier/plugin-oxc`](https://github.com/prettier/prettier/tree/main/packages/plugin-oxc)) for consistent code style
- ✅ [Bun](https://bun.sh) package manager and test runner
- ✅ [Rolldown-powered Vite](https://vite.dev/guide/rolldown), with [React (OXC)](https://github.com/vitejs/vite-plugin-react)
- ✅ Automatic CI with Github Actions
- ✅ Pre-configured for [Cloudflare Workers](https://cloudflare.com) deployment

## Getting Started

To get started, simply clone the repository and run `bun run setup`:

1. Clone the project or [use the template](https://github.com/new?template_owner=startkit-dev&template_name=startkit)

```sh
npx gitpick startkit-dev/startkit my-app
cd my-app
```

2. Run the setup script

```sh
bun run setup
```

This script (located in `./bin/setup`) will install the dependencies, set up your local .env file, and migrate the database.

## Development

Start the development server:

```sh
bun dev
```

## Code Quality

Run all quality checks (formatting, linting, and type checking):

```sh
bun run check
```

Auto-fix formatting and linting issues:

```sh
bun run fix
```

Individual commands:

```sh
bun run format          # Format code with Prettier
bun run format:check    # Check formatting without fixing
bun run lint            # Lint code with ESLint
bun run lint:fix        # Auto-fix linting issues
bun run typecheck       # Run TypeScript type checking
bun test                # Run the test suite
```

## Database

This project uses [Drizzle ORM](https://orm.drizzle.team) configured for [Cloudflare D1](https://developers.cloudflare.com/d1/) by default, but can be swapped to any database of your choosing.

### Database commands:

```sh
bun run db:generate     # Generate database schema migrations
bun run db:migrate      # Apply database migrations (locally)
bun run db:reset        # Reset database (clean + migrate)
bun run db:studio       # Open Drizzle Studio GUI
```

### Setting up the database

To create a new D1 database in production, run:

```sh
bun wrangler d1 create "startkit-db"
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
bun run build
```

## Deployment

This project is configured for automatic deployment to [Cloudflare Workers](https://workers.cloudflare.com/) via GitHub Actions.

### GitHub Environments Setup

GitHub Environments provide secure secret management and deployment protection. Create these environments in your repository settings (`Settings > Environments`):

#### 1. **Production Environment**

- **Name:** `production`
- **Deployment branches:** Restrict to `main` branch only
- **Environment variables:**
  - `BETTER_AUTH_URL` - Your production domain (e.g., `https://startkit.example.com`)
  - `OAUTH_GITHUB_CLIENT_ID` - Github OAuth app ID for production
- **Environment secrets:**
  - `BETTER_AUTH_SECRET` - Generate using `openssl rand -base64 32`
  - `OAUTH_GITHUB_CLIENT_SECRET` - GitHub OAuth app secret for production
- **Protection rules (recommended):**
  - Require reviewers (1+ team members)
  - Wait timer (optional, e.g., 5 minutes)

#### 2. **Preview Environment**

- **Name:** `preview`
- **Deployment branches:** No restrictions (allows any branch)
- **Environment variables:**
  - `BETTER_AUTH_URL` - Auto-generated preview URL (optional override)
  - `OAUTH_GITHUB_CLIENT_ID` - Github OAuth app secret for preview
- **Environment secrets:**
  - `BETTER_AUTH_SECRET` - Generate using `openssl rand -base64 32`
  - `OAUTH_GITHUB_CLIENT_SECRET` - GitHub OAuth app secret for preview (can reuse production or create separate)
- **Protection rules:** None (allows automatic deployments)

### Required Repository Secrets

Configure these secrets in your repository settings (`Settings > Secrets and variables > Actions > Repository secrets`):

- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with `Cloudflare Workers:Edit` and `Cloudflare D1:Edit` permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

### Environment-Specific Configuration

**Production:**

- Uses `BETTER_AUTH_URL` from production environment variable
- Uses `BETTER_AUTH_SECRET` and `OAUTH_GITHUB_CLIENT_SECRET` from production environment secrets
- Requires manual approval if protection rules are enabled
- Deploys to your production domain

**Preview:**

- Auto-generates preview URLs: `https://startkit-preview-pr-{number}.{account}.workers.dev` (unless overridden with environment variable)
- Uses `BETTER_AUTH_SECRET` and `OAUTH_GITHUB_CLIENT_SECRET` from preview environment secrets
- No manual approval required
- Automatically cleaned up when PR is closed

### GitHub OAuth App Configuration

**For Production:**

1. Create a GitHub OAuth app with your production URL as the homepage
2. Set authorization callback URL to: `https://your-domain.com/api/auth/callback/github`
3. Add the Client ID as `OAUTH_GITHUB_CLIENT_ID` (repository secret)
4. Add the Client Secret as `OAUTH_GITHUB_CLIENT_SECRET` (production environment secret)

**For Preview (Two Options):**

**Option 1: Shared OAuth App (Simpler)**

- Use the same OAuth app for both production and preview
- Add multiple callback URLs to your OAuth app:
  - `https://your-domain.com/api/auth/callback/github` (production)
  - `https://startkit-preview-pr-*.{account}.workers.dev/api/auth/callback/github` (preview - add as needed)
- Note: You'll need to manually add preview URLs to your OAuth app settings

**Option 2: Separate OAuth App (Recommended for Security)**

- Create a separate GitHub OAuth app specifically for preview environments
- Set homepage URL to your repository or a placeholder
- Swap the callback URL for preview environments as needed:
  - `https://startkit-preview-pr-1.{account}.workers.dev/api/auth/callback/github`
  - `https://startkit-preview-pr-2.{account}.workers.dev/api/auth/callback/github`
  - (Add more as needed for active PRs)
- Override `OAUTH_GITHUB_CLIENT_ID` and `OAUTH_GITHUB_CLIENT_SECRET` in preview environment

**⚠️ OAuth Callback URL Limitation:**
GitHub OAuth apps don't support wildcard callback URLs, making it unusable in preview URLs for now. We will give instructions for setting up a `proxy`.

### Deployment Workflow

**Pull Requests:**

- Runs code quality checks (`bun run check`)
- Creates a preview deployment with dedicated database
- Posts preview URL in PR comments
- Automatically cleans up preview environment when PR is closed

**Main Branch:**

- Runs code quality checks
- Applies database migrations to production
- Deploys to production Cloudflare Workers

### Initial Cloudflare Setup

1. **Create production database:**

   ```sh
   bunx wrangler d1 create "startkit-db"
   ```

2. **Update `wrangler.jsonc`** with your database ID from the previous step

3. **Run initial migration:**
   ```sh
   bun run db:migrate:prod
   ```

### Manual Deployment

For manual deployments:

```sh
# Deploy to production
bun run build
bunx wrangler deploy

# Deploy with database migrations
bun run db:migrate:prod
bunx wrangler deploy
```

## Utilities

```sh
bun run clean           # Clean cache directories
bun run nuke            # Clean everything including node_modules
bun run outdated        # Check for package updates interactively
```
