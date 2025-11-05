import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd()); // ✅ loads .env automatically

import { defineConfig, env } from "prisma/config";


export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
