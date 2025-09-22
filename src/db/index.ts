import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import config from "../config/env.config";
import * as schema from "../domain/schema";
import WinstonLogger from "../common/winston.logger";

const logger = WinstonLogger();

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 20, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Create drizzle database instance
export const db = drizzle(pool, { schema });

// Export the pool for direct access if needed
export { pool };

// Database health check function
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    logger.info("Database connection successful");
    return true;
  } catch (error) {
    logger.error("Database connection failed:", error);
    return false;
  }
}

// Graceful shutdown function
export async function closeDatabaseConnection(): Promise<void> {
  await pool.end();
  logger.info("Database connection pool closed");
}
