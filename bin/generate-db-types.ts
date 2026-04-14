#!/usr/bin/env bun
import { Database } from "bun:sqlite"
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

const MIGRATIONS_DIR = "migrations"
const OUT_FILE = "src/db/types.gen.ts"

const tmpDir = mkdtempSync(join(tmpdir(), "startkit-db-codegen-"))
const scratchPath = join(tmpDir, "scratch.sqlite")

try {
  const db = new Database(scratchPath, { create: true })
  const migrations = readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".sql"))
    .toSorted()

  console.log(`Applying ${migrations.length} migration(s) to scratch SQLite`)
  for (const file of migrations) {
    const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf8")
    db.exec(sql)
  }
  db.close()

  const codegen = Bun.spawnSync({
    cmd: [
      "bunx",
      "kysely-codegen",
      "--dialect",
      "bun-sqlite",
      "--camel-case",
      "--out-file",
      OUT_FILE
    ],
    env: { ...process.env, DATABASE_URL: scratchPath },
    stdout: "inherit",
    stderr: "inherit"
  })
  if (codegen.exitCode !== 0) {
    process.exit(codegen.exitCode ?? 1)
  }
} finally {
  rmSync(tmpDir, { recursive: true, force: true })
}
