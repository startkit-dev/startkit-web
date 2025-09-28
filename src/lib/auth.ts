import { getDb } from "@/db/client"
import * as schema from "@/db/schema"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { env } from "cloudflare:workers"

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  url: env.BETTER_AUTH_URL,
  database: drizzleAdapter(getDb(), {
    provider: "sqlite",
    schema: {
      user: schema.usersTable,
      session: schema.sessionsTable,
      account: schema.accountsTable,
      verification: schema.verificationTable
    }
  }),
  socialProviders: {
    github: {
      clientId: env.OAUTH_GITHUB_CLIENT_ID,
      clientSecret: env.OAUTH_GITHUB_CLIENT_SECRET
    }
  }
})
