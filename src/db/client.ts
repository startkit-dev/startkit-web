import { env } from "cloudflare:workers"
import { Kysely } from "kysely"
import { D1Dialect } from "kysely-d1"

import type { Database } from "./types"

export function getDb() {
  return new Kysely<Database>({
    dialect: new D1Dialect({ database: env.DB })
  })
}

export type DatabaseClient = ReturnType<typeof getDb>
