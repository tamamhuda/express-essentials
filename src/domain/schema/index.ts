
// Export all schemas for Drizzle
import {user} from "./auth.schema";

export * from './auth.schema'

export type User =  typeof user.$inferSelect;
