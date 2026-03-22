import path from "node:path"
import "dotenv/config"
import { defineConfig, env } from "prisma/config"

export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    // We use the direct connection for migrations and pushes
    url: env("DIRECT_URL"),
  },
})
