// src/routes/orderRoutes.ts
import { Router } from "express";
import { OrderController } from "../controllers/orderController";
import { validateDto } from "../middleware/validation";
import { CreateOrderDto, GetOrdersQueryDto } from "../dtos/order";

/**
 * Order Router Module
 *
 * For a complete implementation guide, see:
 * 'How to Build a REST API with Node.js and TypeScript'
 * https://medium.com/@holasoymalva/how-to-build-a-rest-api-with-node-js-and-typescript-3491ddd19f95
 */

const router = Router();
const orderController = new OrderController();

router.get("/orders", validateDto(GetOrdersQueryDto, "query"), (req, res) =>
  orderController.getOrders(req, res)
);

router.post("/orders", validateDto(CreateOrderDto, "body"), (req, res) =>
  orderController.createOrder(req, res)
);

export default router;
