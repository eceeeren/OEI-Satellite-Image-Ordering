import { Router, Request, Response } from "express";
import { randomUUID } from "crypto";
import { pool } from "../index";

/**
 * Order Router Module
 *
 * For a complete implementation guide, see:
 * 'How to Build a REST API with Node.js and TypeScript'
 * https://medium.com/@holasoymalva/how-to-build-a-rest-api-with-node-js-and-typescript-3491ddd19f95
 *
 * Development notes:
 * - Database queries developed with assistance from Claude (Anthropic)
 */

const router = Router();

router.get("/orders", async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;
  const { minPrice, maxPrice, startDate, endDate } = req.query;
  const offset = (page - 1) * limit;

  // Input validation
  if (page < 1 || limit < 1) {
    res.status(400).json({ error: "Page and limit must be positive numbers" });
  }

  let query = `
    SELECT id as "orderId", 
           image_id as "imageId", 
           price, 
           created_at as "createdAt"
    FROM orders 
    WHERE 1=1`;
  const params = [];
  let paramNum = 1;

  // Filter the prices (in decimal format)
  if (minPrice) {
    query += ` AND CAST(price AS DECIMAL) >= $${paramNum++}`;
    params.push(minPrice);
  }
  if (maxPrice) {
    query += ` AND CAST(price AS DECIMAL) <= $${paramNum++}`;
    params.push(maxPrice);
  }
  // Filter the dates (Format: YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ)
  if (startDate) {
    query += ` AND created_at >= $${paramNum++}::timestamptz`;
    params.push(startDate);
  }
  if (endDate) {
    query += ` AND created_at <= $${paramNum++}::timestamptz`;
    params.push(endDate);
  }

  // Total count
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM orders WHERE 1=1${
      query.split("WHERE 1=1")[1].split("LIMIT")[0]
    }`,
    params
  );

  const totalCount = parseInt(countResult.rows[0].count);

  // Paginated orders
  query += ` ORDER BY created_at DESC LIMIT $${paramNum} OFFSET $${
    paramNum + 1
  }`;
  params.push(limit, offset);

  try {
    const result = await pool.query(query, params);
    res.json({
      orders: result.rows,
      total: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/orders", async (req: Request, res: Response) => {
  const { imageId, price } = req.body;

  // Input validation
  if (!imageId || !price) {
    res.status(400).json({ error: "ImageId and price are required" });
  }

  if (typeof price !== "number" || price <= 0) {
    res.status(400).json({ error: "Price must be a positive number" });
  }

  const orderId = randomUUID();

  try {
    // Verify that the image exists first
    const imageCheck = await pool.query(
      "SELECT catalog_id FROM satellite_images WHERE catalog_id = $1",
      [imageId]
    );

    if (imageCheck.rows.length === 0) {
      res.status(404).json({ message: "Image not found" });
    }

    const result = await pool.query(
      `INSERT INTO orders (id, image_id, price, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id as "orderId", image_id as "imageId", price, created_at as "createdAt"`,
      [orderId, imageId, price]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
