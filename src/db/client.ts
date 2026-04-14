import { env } from "cloudflare:workers"
import { CamelCasePlugin, Kysely } from "kysely"
import { D1Dialect } from "kysely-d1"

import type { Database } from "./types"

export function getDb() {
  return new Kysely<Database>({
    dialect: new D1Dialect({ database: env.DB }),
    plugins: [new CamelCasePlugin()]
  })
}

export type DatabaseClient = ReturnType<typeof getDb>
