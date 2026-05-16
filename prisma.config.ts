import { defineConfig } from "prisma/config";
import { env } from "./src/config/env.config.js";

console.log("db_url", env.db_url);
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env.db_url,
  },
});
