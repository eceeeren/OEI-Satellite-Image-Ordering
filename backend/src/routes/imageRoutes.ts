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
  const { startDate, endDate, area } = req.query;
  const offset = (page - 1) * limit;

  // Input validation
  if (page < 1 || limit < 1) {
    res.status(400).json({ error: "Page and limit must be positive numbers" });
    return;
  }

  let query = `
    SELECT 
      catalog_id as "catalogId",
      ST_AsGeoJSON(coverage_area)::json as geometry,
      created_at as "createdAt"
    FROM satellite_images 
    WHERE 1=1`;
  const params = [];
  let paramNum = 1;

  // Filter the dates (Format: YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ)
  if (startDate) {
    query += ` AND created_at >= $${paramNum++}::timestamptz`;
    params.push(startDate);
  }
  if (endDate) {
    query += ` AND created_at <= $${paramNum++}::timestamptz`;
    params.push(endDate);
  }

  // Filter images within the boundaries of a specific area of interest
  if (area) {
    try {
      const geojson = JSON.parse(area as string);
      query += ` AND ST_Intersects(coverage_area, ST_SetSRID(ST_GeomFromGeoJSON($${paramNum++}), 4326))`;
      params.push(JSON.stringify(geojson));
    } catch (error) {
      res.status(400).json({ error: "Invalid GeoJSON format" });
      return;
    }
  }

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM satellite_images WHERE 1=1${
      query.split("WHERE 1=1")[1].split("ORDER BY")[0]
    }`,
    params
  );

  const totalCount = parseInt(countResult.rows[0].count);

  query += ` ORDER BY catalog_id LIMIT $${paramNum} OFFSET $${paramNum + 1}`;
  params.push(limit, offset);

  try {
    const result = await pool.query(query, params);
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
