import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { CheckIcon } from "lucide-react"
import { Suspense } from "react"

import { Wordmark } from "@/components/brand/wordmark"
import { RefreshButton } from "@/components/refresh-button"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site-config"
import { serverTimeQueryOptions } from "@/lib/query-options/server-time-options"
import { usersCountQueryOptions } from "@/lib/query-options/users-count-options"
import { seo } from "@/lib/seo"

const features = [
  "TanStack Start on React 19",
  "Cloudflare Workers + D1 SQLite",
  "Kysely query builder (type-safe SQL)",
  "Better-Auth with GitHub OAuth",
  "Tailwind CSS 4 + shadcn/ui on Base UI",
  "TanStack Query for data fetching",
  "OXC toolchain: OxLint + OxFmt",
  "Valibot-validated environment variables",
  "Bun package manager & test runner",
  "Strict TypeScript end-to-end"
] as const

export const Route = createFileRoute("/_main/")({
  head: () => {
    return {
      meta: seo({ title: "A sane way to start with Tanstack Start" })
    }
  },
  component: RouteComponent
})

function RouteComponent() {
  return (
    <main className="flex grow items-center justify-center p-2">
      <div className="container mx-auto flex max-w-md flex-col items-start gap-8">
        <div className="flex flex-row items-center gap-2">
          <Wordmark className="h-11" />
        </div>
        <ul className="flex flex-col gap-2 text-left text-sm">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button
            variant="secondary"
            render={
              // oxlint-disable-next-line jsx-a11y/anchor-has-content
              <a
                href={siteConfig.links.github}
                rel="noopener noreferrer"
                target="_blank"
              />
            }
          >
            Documentation
          </Button>
        </div>

        <div className="flex items-center justify-center gap-1 text-xs">
          <span className="font-bold">Server Time:</span>
          <Suspense fallback="Loading...">
            <ServerTime />
          </Suspense>
        </div>

        <div className="flex items-center justify-center gap-1 text-xs">
          <span className="font-bold">Users:</span>
          <Suspense fallback="Loading...">
            <UsersCount />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

function ServerTime() {
  const { data: serverTime, refetch } = useSuspenseQuery(
    serverTimeQueryOptions()
  )

  return (
    <>
      <span suppressHydrationWarning>{serverTime.toLocaleString()}</span>
      <RefreshButton onClick={refetch} />
    </>
  )
}

function UsersCount() {
  const { data: usersCount, refetch } = useSuspenseQuery(
    usersCountQueryOptions()
  )

  return (
    <>
      <span suppressHydrationWarning>{usersCount}</span>
      <RefreshButton onClick={refetch} />
    </>
  )
}
