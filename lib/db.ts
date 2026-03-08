import path from "node:path"
import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

const url = process.env.DATABASE_URL ?? "file:./dev.db"
const dbPath = url.replace(/^file:/, "")
const absolutePath = path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath)
const adapter = new PrismaBetterSqlite3({ url: `file:${absolutePath}` })

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
