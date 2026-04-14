import { betterAuth } from "better-auth"
import { env } from "cloudflare:workers"

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  url: env.BETTER_AUTH_URL,
  database: env.DB,
  socialProviders: {
    github: {
      clientId: env.OAUTH_GITHUB_CLIENT_ID,
      clientSecret: env.OAUTH_GITHUB_CLIENT_SECRET
    }
  }
})
