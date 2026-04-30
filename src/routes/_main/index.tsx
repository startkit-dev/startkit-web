import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"

import { Wordmark } from "@/components/brand/wordmark"
import { RefreshButton } from "@/components/refresh-button"
import { siteConfig } from "@/config/site-config"
import { serverTimeQueryOptions } from "@/lib/query-options/server-time-options"
import { usersCountQueryOptions } from "@/lib/query-options/users-count-options"
import { seo } from "@/lib/seo"

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
        <p className="text-justify text-xl leading-relaxed text-muted-foreground">
          A minimal starter kit for{" "}
          <strong className="text-foreground">TanStack Start</strong> and{" "}
          <strong className="text-foreground">React</strong> on{" "}
          <strong className="text-foreground">Cloudflare Workers</strong>, with{" "}
          <strong className="text-foreground">D1</strong> with{" "}
          <strong className="text-foreground">Kysely</strong>. Pre-configured
          with <strong className="text-foreground">Better-Auth</strong>,{" "}
          <strong className="text-foreground">TanStack Query</strong>,{" "}
          <strong className="text-foreground">Tailwind CSS</strong> with{" "}
          <strong className="text-foreground">Base UI</strong>-flavored{" "}
          <strong className="text-foreground">shadcn/ui</strong>, and the{" "}
          <strong className="text-foreground">OXC</strong> toolchain — all
          powered by <strong className="text-foreground">Bun</strong> and strict{" "}
          <strong className="text-foreground">TypeScript</strong>. See more on{" "}
          <a
            href={siteConfig.links.github}
            rel="noopener noreferrer"
            target="_blank"
            className="font-bold text-foreground underline underline-offset-4 hover:text-primary"
          >
            Github
          </a>
          .
        </p>

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
