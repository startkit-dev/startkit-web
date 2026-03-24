import { env } from "cloudflare:workers"
import { drizzle } from "drizzle-orm/d1"

import * as schema from "./schema"

/**
 * Returns a drizzle instance for the database.
 *
 * @example
 * ```ts
 * import { getDb } from "./db/client"
 * const db = getDb()
 * ```
 *
 * @returns A drizzle instance for the database.
 */
export function getDb() {
  return drizzle(env.DB, {
    logger: true,
    schema
  })
}

export type DatabaseClient = ReturnType<typeof getDb>
