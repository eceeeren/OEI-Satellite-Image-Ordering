import { Router, Request, Response } from "express";
import { pool } from "../index";

/**
 * Image Router Module
 *
 * For a complete implementation guide, see:
 * 'How to Build a REST API with Node.js and TypeScript'
 * https://medium.com/@holasoymalva/how-to-build-a-rest-api-with-node-js-and-typescript-3491ddd19f95
 *
 * Development notes:
 * - Database queries developed with assistance from Claude (Anthropic)
 */

const router = Router();

router.get("/images", async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;
  const offset = (page - 1) * limit;

  try {
    // Total count
    const countResult = await pool.query(
      "SELECT COUNT(*) FROM satellite_images"
    );
    const totalCount = parseInt(countResult.rows[0].count);

    // Paginated results
    const result = await pool.query(
      `
      SELECT 
        catalog_id as "catalogId",
        ST_AsGeoJSON(coverage_area)::json as geometry
      FROM satellite_images
      ORDER BY catalog_id
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    res.json({
      images: result.rows,
      total: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
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
