import { Pool, PoolConfig } from "pg";
import { DatabaseConfig } from "../types/custom";

/**
 * Database Module
 *
 * For a complete implementation guide, see:
 * 'How to Connect a Postgres Database to Express: A Step-by-Step Guide'
 * https://medium.com/@eslmzadpc13/how-to-connect-a-postgres-database-to-express-a-step-by-step-guide-b2fffeb8aeac
 */

const getDatabaseConfig = (): DatabaseConfig => {
  const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    DB_HOST,
    POSTGRES_DB,
    POSTGRES_PORT,
  } = process.env;

  if (!POSTGRES_USER || !POSTGRES_PASSWORD || !DB_HOST || !POSTGRES_DB) {
    throw new Error("Missing required database environment variables");
  }

  return {
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    host: DB_HOST,
    database: POSTGRES_DB,
    port: Number(POSTGRES_PORT) || 5432,
  };
};

export const createPool = (): Pool => {
  const config = getDatabaseConfig();
  return new Pool(config as PoolConfig);
};
