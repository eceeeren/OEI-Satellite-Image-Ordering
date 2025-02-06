import { Router, Request, Response } from "express";
import { ImageController } from "../controllers/imageController";

/**
 * Image Router Module
 *
 * For a complete implementation guide, see:
 * 'How to Build a REST API with Node.js and TypeScript'
 * https://medium.com/@holasoymalva/how-to-build-a-rest-api-with-node-js-and-typescript-3491ddd19f95
 */

const router = Router();
const imageController = new ImageController();

router.get("/images", (req: Request, res: Response) =>
  imageController.getImages(req, res)
);
router.get("/images/:id", (req: Request, res: Response) =>
  imageController.getImageById(req, res)
);

export default router;
