// src/routes/images.ts
import { Router } from "express";
import { ImageController } from "../controllers/imageController";
import { validateDto } from "../middleware/validation";
import { GetImagesQueryDto, GetImageParamsDto } from "../dtos/image";

const router = Router();
const imageController = new ImageController();

router.get("/images", validateDto(GetImagesQueryDto, "query"), (req, res) =>
  imageController.getImages(req, res)
);

router.get(
  "/images/:id",
  validateDto(GetImageParamsDto, "params"),
  (req, res) => imageController.getImageById(req, res)
);

export default router;
