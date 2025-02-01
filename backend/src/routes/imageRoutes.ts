import { Router, Request, Response } from "express";
import { pool } from "../index";

const router = Router();

router.get("/images", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        catalog_id as "catalogId",
        ST_AsGeoJSON(coverage_area)::json as geometry
      FROM satellite_images
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/images/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      `
      SELECT 
        catalog_id as "catalogId",
        ST_AsGeoJSON(coverage_area)::json as geometry
      FROM satellite_images
      WHERE catalog_id = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Image not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
