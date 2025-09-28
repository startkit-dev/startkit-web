# Deployment

This project is configured for automatic deployment to [Cloudflare Workers](https://workers.cloudflare.com/) via GitHub Actions using Cloudflare's preview_urls for clean preview deployments.

## Known Limitations

- To deploy a preview version of an worker, Cloudflare requires you to deploy via `wrangler deploy` at least one time first to set everything up. You can do this locally by running `CLOUDFLARE_ENV=preview bun run build; bun wrangler deploy`.
- Secrets upload for preview environments is not working as expected with the cloudflare vite plugin. Secrets should be set manually as well.
- Cloudflare D1 databases don't work seamlessly with preview worker deployments. We will add logic to create and cleanup per-branch D1 databases, but for now we have a single, shared preview DB URL.

## Prerequisites

### 1. Create Cloudflare Databases

Create the required D1 databases manually:

```bash
# Create production database
bunx wrangler d1 create "startkit-db"

# Create preview database
bunx wrangler d1 create "startkit-preview-db"
```

Update `wrangler.jsonc` with the database IDs returned from these commands.

### 2. Required GitHub Secrets

Configure these secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions > Repository secrets`):

- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with `Cloudflare Workers:Edit` and `Cloudflare D1:Edit` permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

### 3. GitHub Environments Setup

GitHub Environments provide secure secret management and deployment protection. Create these environments in your repository settings (`Settings > Environments`):

#### Production Environment

- **Name:** `production`
- **Deployment branches:** Restrict to `main` branch only
- **Environment variables:**
  - `BETTER_AUTH_URL` - Your production domain (e.g., `https://startkit.dev`)
  - `OAUTH_GITHUB_CLIENT_ID` - Github OAuth app ID for production
- **Environment secrets:**
  - `BETTER_AUTH_SECRET` - Generate using `openssl rand -base64 32`
  - `OAUTH_GITHUB_CLIENT_SECRET` - GitHub OAuth app secret for production
- **Protection rules (recommended):**
  - Require reviewers (1+ team members)
  - Wait timer (optional, e.g., 5 minutes)

#### Preview Environment

- **Name:** `preview`
- **Deployment branches:** No restrictions (allows any branch)
- **Environment variables:**
  - `OAUTH_GITHUB_CLIENT_ID` - Github OAuth app ID for preview
- **Environment secrets:**
  - `BETTER_AUTH_SECRET` - Generate using `openssl rand -base64 32`
  - `OAUTH_GITHUB_CLIENT_SECRET` - GitHub OAuth app secret for preview
- **Protection rules:** None (allows automatic deployments)

## Deployment Workflow

### Pull Requests

**Workflow:** `.github/workflows/preview.yml`

- Runs code quality checks (`bun run check`)
- Creates a preview deployment with unique URL: `https://pr-{number}-startkit-preview.blendist.workers.dev` (replace `blendist` with your Workers subdomain)
- Uses shared preview database for all PRs
- Posts preview URL in PR comments (updates same comment on each run)
- Preview deployments automatically expire and clean up

### Main Branch (Production)

**Workflow:** `.github/workflows/deploy.yml`

- Runs code quality checks (`bun run check`)
- Applies database migrations to production database
- Deploys to production Cloudflare Workers
- Concurrency control prevents multiple simultaneous deployments
- Can also be triggered manually via `workflow_dispatch`

## GitHub OAuth App Configuration

### For Production

1. Create a GitHub OAuth app with your production URL as the homepage
1. Set authorization callback URL to: `https://startkit.dev/api/auth/callback/github`
1. Add the Client ID as `OAUTH_GITHUB_CLIENT_ID` (environment variable)
1. Add the Client Secret as `OAUTH_GITHUB_CLIENT_SECRET` (production environment secret)

### For Preview (Recommended Setup)

**Create a Separate Preview OAuth App:**

1. Create a separate GitHub OAuth app specifically for preview environments
1. Set the authorization callback URL to your Cloudflare account subdomain (e.g., `https://blendist.workers.dev/api/auth/callback/github`)
1. Override `OAUTH_GITHUB_CLIENT_ID` and `OAUTH_GITHUB_CLIENT_SECRET` in the preview environment

**✅ Preview aliases work automatically:**

GitHub allows any subdomain of the registered host, so callback URLs like `https://pr-{number}-startkit-preview.blendist.workers.dev/api/auth/callback/github` (replace `blendist` with your Workers subdomain) redirect successfully without manual updates.

## Manual Deployment

For manual deployments:

```bash
# Deploy to production
bunx wrangler deploy

# Deploy with database migrations
bunx wrangler d1 migrations apply DB
bunx wrangler deploy

# Deploy preview version
bunx wrangler versions upload --preview-alias my-test
```

## How It Works

### Preview System

Uses Cloudflare's versioning system instead of creating separate workers:

- `wrangler versions upload --preview-alias pr-123` creates unique preview URLs
- All previews share the same preview database
- No manual cleanup needed - preview versions expire automatically
- Each PR gets a unique URL like `https://pr-123-startkit-preview.blendist.workers.dev` (replace `blendist` with your Workers subdomain)

### Build Process

`wrangler.jsonc` points `main` to `@tanstack/react-start/server-entry`, so the Cloudflare bundler (and the `@cloudflare/vite-plugin`) build the Worker automatically during `wrangler deploy`. Running `bun run build` manually creates the `dist/` output if you want to inspect the generated worker or serve the static client locally.
