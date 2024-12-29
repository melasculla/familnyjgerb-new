import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from '../db/schema';
import pkg from "pg";

const config = useRuntimeConfig()

const { Pool } = pkg
export const connection = new Pool({
  connectionString: config.postgresUrl
})

export const db = drizzle(connection, { schema })