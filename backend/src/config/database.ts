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
  const config: DatabaseConfig = {
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    host: "postgres",
    database: process.env.POSTGRES_DB!,
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
  };

  return config;
};

export const createPool = (): Pool => {
  const config = getDatabaseConfig();
  return new Pool(config as PoolConfig);
};
