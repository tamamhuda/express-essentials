import { defineConfig } from "drizzle-kit";
import config from "./src/config/env.config";

export default defineConfig({
  schema: "./src/domain/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: config.DATABASE_URL,
  },
  verbose: true,
  strict: true,

});