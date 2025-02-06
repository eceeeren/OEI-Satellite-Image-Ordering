import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { AppDataSource } from "../data-source";
import { Order } from "../models/Order";
import { SatelliteImage } from "../models/SatelliteImage";
import { Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import { CreateOrderDto, GetOrdersQueryDto } from "../dtos/order";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

export class OrderController {
  private orderRepository = AppDataSource.getRepository(Order);
  private imageRepository = AppDataSource.getRepository(SatelliteImage);

  async getOrders(req: Request, res: Response) {
    try {
      // Validate query parameters
      const queryDto = plainToClass(GetOrdersQueryDto, req.query);
      const errors = await validate(queryDto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const { page, limit, minPrice, maxPrice, startDate, endDate } = queryDto;
      const offset = (page - 1) * limit;

      const whereClause: any = {};

      if (minPrice && maxPrice) {
        whereClause.price = Between(minPrice, maxPrice);
      } else if (minPrice) {
        whereClause.price = MoreThanOrEqual(minPrice);
      } else if (maxPrice) {
        whereClause.price = LessThanOrEqual(maxPrice);
      }

      if (startDate && endDate) {
        whereClause.created_at = Between(
          new Date(startDate),
          new Date(endDate)
        );
      }

      const [orders, total] = await this.orderRepository.findAndCount({
        where: whereClause,
        skip: offset,
        take: limit,
        order: { created_at: "DESC" },
      });

      return res.json({
        data: orders,
        metadata: {
          total,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          limit,
        },
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async createOrder(req: Request, res: Response) {
    try {
      const orderDto = plainToClass(CreateOrderDto, req.body);
      const errors = await validate(orderDto);

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const { imageId, price } = orderDto;

      // Check if image exists
      const image = await this.imageRepository.findOneBy({
        catalog_id: imageId,
      });
      if (!image) {
        return res.status(404).json({ error: "Image not found" });
      }

      const order = this.orderRepository.create({
        id: randomUUID(),
        image_id: imageId,
        price: price.toString(),
        created_at: new Date(),
      });

      const savedOrder = await this.orderRepository.save(order);
      return res.status(201).json({ data: savedOrder });
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
