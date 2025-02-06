import { Router, Request, Response } from "express";
import { OrderController } from "../controllers/orderController";

/**
 * Order Router Module
 *
 * For a complete implementation guide, see:
 * 'How to Build a REST API with Node.js and TypeScript'
 * https://medium.com/@holasoymalva/how-to-build-a-rest-api-with-node-js-and-typescript-3491ddd19f95
 */

const router = Router();
const orderController = new OrderController();

router.get("/orders", (req: Request, res: Response) =>
  orderController.getOrders(req, res)
);
router.post("/orders", (req: Request, res: Response) =>
  orderController.createOrder(req, res)
);

export default router;
