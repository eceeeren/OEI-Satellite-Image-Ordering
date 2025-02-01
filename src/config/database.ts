import { Pool, PoolConfig } from "pg";
import { DatabaseConfig } from "../types/custom";

const getDatabaseConfig = (): DatabaseConfig => {
  const config: DatabaseConfig = {
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    host: process.env.POSTGRES_DB_HOST!,
    database: process.env.POSTGRES_DB!,
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
  };

  return config;
};

export const createPool = (): Pool => {
  const config = getDatabaseConfig();
  return new Pool(config as PoolConfig);
};
