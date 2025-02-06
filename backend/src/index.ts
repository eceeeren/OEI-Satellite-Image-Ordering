import "reflect-metadata";
import "dotenv/config";
import cors from "cors";
import express, { Express } from "express";
import { AppDataSource } from "./data-source";
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

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || "3000", 10);

const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connection successful");
  } catch (err) {
    console.error("Error connecting to the database:", err);
    throw err;
  }
};

const initializeApp = async () => {
  try {
    await initializeDatabase();

    // Middleware
    app.use(
      cors({
        origin: "https://oei-satellite-image-ordering-jmja.onrender.com",
        credentials: true,
      })
    );
    app.use(express.json());

    // Routes
    app.get("/", (_req, res) => {
      res.json({
        message: "Welcome to the Satellite Image Ordering API",
        version: "1.0.0",
        status: "running",
      });
    });

    app.use("/api", imageRoutes);
    app.use("/api", orderRoutes);

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to initialize application:", err);
    process.exit(1);
  }
};

// Application shutdown
process.on("SIGINT", async () => {
  try {
    await AppDataSource.destroy();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
});

initializeApp();
