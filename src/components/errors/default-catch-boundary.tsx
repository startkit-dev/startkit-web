import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
  type ErrorComponentProps
} from "@tanstack/react-router"
import { useCallback } from "react"

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId
  })

  console.error(error)

  const handleRetry = useCallback(() => {
    void router.invalidate()
  }, [router])

  const handleGoBack = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    window.history.back()
  }, [])

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-4">
      <ErrorComponent error={error} />
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleRetry}
          className={`rounded-sm bg-gray-600 px-2 py-1 font-extrabold text-white uppercase dark:bg-gray-700`}
        >
          Try Again
        </button>
        {isRoot ? (
          <Link
            to="/"
            className={`rounded-sm bg-gray-600 px-2 py-1 font-extrabold text-white uppercase dark:bg-gray-700`}
          >
            Home
          </Link>
        ) : (
          <Link
            to="/"
            className={`rounded-sm bg-gray-600 px-2 py-1 font-extrabold text-white uppercase dark:bg-gray-700`}
            onClick={handleGoBack}
          >
            Go Back
          </Link>
        )}
      </div>
    </div>
  )
}
