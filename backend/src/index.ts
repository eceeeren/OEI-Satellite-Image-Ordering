import "dotenv/config";
import cors from "cors";
import express, { Express } from "express";
import { createPool } from "./config/database";
import imageRoutes from "./routes/imageRoutes";
import orderRoutes from "./routes/orderRoutes";

/**
 * Main Application Module
 *
 * For a complete implementation guide, see:
 * 'How to Build a REST API with Node.js and TypeScript'
 * https://medium.com/@holasoymalva/how-to-build-a-rest-api-with-node-js-and-typescript-3491ddd19f95
 *
 * Development notes:
 * - Code structure and formatting assisted by Claude (Anthropic)
 */

export const pool = createPool();
const app: Express = express();
const PORT: number = parseInt(process.env.PORT || "3000", 10);

const testDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    try {
      await client.query("SELECT NOW()");
      console.log("Database connection successful");
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
};

const initializeApp = async () => {
  try {
    await testDatabaseConnection();

    app.use(
      cors({
        origin: "https://oei-satellite-image-ordering-jmja.onrender.com",
        credentials: true,
      })
    );

    app.get("/", (_req, res) => {
      res.json({
        message: "Welcome to the Satellite Image Ordering API",
        version: "1.0.0",
        status: "running",
      });
    });

    app.use(express.json());
    app.use("/api", imageRoutes);
    app.use("/api", orderRoutes);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to initialize application:", err);
    process.exit(1);
  }
};

initializeApp();
