import { DataSource } from "typeorm";
import { SatelliteImage } from "./models/SatelliteImage";
import { Order } from "./models/Order";

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

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: Number(POSTGRES_PORT) || 5432,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  synchronize: false,
  logging: true,
  entities: [SatelliteImage, Order],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});
