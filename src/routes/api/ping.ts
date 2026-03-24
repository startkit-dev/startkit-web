import { createFileRoute } from "@tanstack/react-router"
import { json } from "@tanstack/react-start"
import { env } from "cloudflare:workers"

import { type ApiResponse } from "@/lib/api-fns/api-response"

export const Route = createFileRoute("/api/ping")({
  server: {
    handlers: {
      GET: (): ApiResponse<{ pong: string }> => {
        return json({
          ok: true,
          data: {
            pong: new Date().toISOString(),
            betterAuthUrl: env.BETTER_AUTH_URL ?? "not set",
            oauthGithubClientId: env.OAUTH_GITHUB_CLIENT_ID ?? "not set",
            oauthGithubClientSecret: env.OAUTH_GITHUB_CLIENT_SECRET ?? "not set"
          }
        })
      }
    }
  }
})
