import { Router, Request, Response } from "express";
import { randomUUID } from "crypto";
import ordersData from "../data/orders.json";

interface OrderData {
  orderId: string;
  catalogID: string;
  price: string;
  date: string;
}

const router = Router();

router.get("/orders", (_req: Request, res: Response) => {
  res.json(ordersData as OrderData[]);
});

router.post("/orders", (req: Request, res: Response) => {
  const { catalogID, price } = req.body;

  const newOrder: OrderData = {
    orderId: randomUUID(),
    catalogID,
    price,
    date: new Date().toISOString(),
  };

  res.status(201).json(newOrder);
});

export default router;
