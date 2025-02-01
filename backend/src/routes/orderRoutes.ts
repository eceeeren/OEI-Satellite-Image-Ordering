import { Router, Request, Response } from "express";
import { randomUUID } from "crypto";
import { pool } from "../index";

const router = Router();

router.get("/orders", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        orders.id as "orderId",
        orders.image_id as "imageId",
        orders.price,
        orders.created_at as "createdAt"
      FROM orders
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/orders", async (req: Request, res: Response) => {
  const { imageId, price } = req.body;
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
