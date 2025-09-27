import { type ApiResponse } from "@/lib/api-fns/api-response"
import { createFileRoute } from "@tanstack/react-router"
import { json } from "@tanstack/react-start"

export const Route = createFileRoute("/api/ping")({
  server: {
    handlers: {
      GET: (): ApiResponse<{ pong: string }> => {
        return json({
          ok: true,
          data: {
            pong: new Date().toISOString()
          }
        })
      }
    }
  }
})
