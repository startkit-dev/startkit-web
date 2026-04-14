import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"

import { getDb } from "@/db/client"

const getUsersCount = createServerFn().handler(async () => {
  const db = getDb()
  const result = await db
    .selectFrom("users")
    .select((eb) => eb.fn.countAll<number>().as("count"))
    .executeTakeFirstOrThrow()
  return result.count
})

/**
 * Query options for the users count
 *
 * @example
 * ```tsx
 * const { data } = useQuery(usersCountQueryOptions())
 * console.log(data)
 * ```
 */
export const usersCountQueryOptions = () =>
  queryOptions({
    queryKey: ["users-count"],
    queryFn: async () => {
      const usersCount = await getUsersCount()
      return usersCount
    }
  })
