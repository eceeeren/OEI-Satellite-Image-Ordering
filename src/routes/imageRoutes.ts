import { Router, Request, Response } from "express";
import imagesData from "../data/images.json";

interface Geometry {
  type: "Polygon";
  coordinates: number[][][];
}

interface ImageData {
  catalogID: string;
  geometry: Geometry;
}

const router = Router();

router.get("/images", (_req: Request, res: Response) => {
  res.json(imagesData as ImageData[]);
});

router.get("/images/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const image = (imagesData as ImageData[]).find((img) => img.catalogID === id);

  if (!image) {
    res.status(404).json({ message: "Image not found" });
  }

  res.json(image);
});

export default router;
