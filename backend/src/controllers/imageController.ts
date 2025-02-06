import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { SatelliteImage } from "../models/SatelliteImage";
import { GetImagesQueryDto, GetImageParamsDto } from "../dtos/image";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Between, Raw } from "typeorm";

export class ImageController {
  private imageRepository = AppDataSource.getRepository(SatelliteImage);

  async getImages(req: Request, res: Response) {
    try {
      // Validate query parameters
      const queryDto = plainToClass(GetImagesQueryDto, req.query);
      const errors = await validate(queryDto);

      if (errors.length > 0) {
        return res.status(400).json({
          error: "Validation failed",
          details: errors,
        });
      }

      const { page, limit, startDate, endDate, area } = queryDto;
      const offset = (page - 1) * limit;

      const whereClause: any = {};

      // Add date filters
      if (startDate || endDate) {
        whereClause.created_at = Between(
          startDate ? new Date(startDate) : new Date(0),
          endDate ? new Date(endDate) : new Date()
        );
      }

      // Add area filter if provided
      if (area) {
        try {
          const geojson = JSON.parse(area);
          whereClause.coverage_area = Raw(
            (alias) =>
              `ST_Intersects(${alias}, ST_SetSRID(ST_GeomFromGeoJSON(:geometry), 4326))`,
            { geometry: JSON.stringify(geojson) }
          );
        } catch (error) {
          return res.status(400).json({ error: "Invalid GeoJSON format" });
        }
      }

      // Get images with count
      const [images, total] = await this.imageRepository.findAndCount({
        select: {
          catalog_id: true,
          coverage_area: true,
          created_at: true,
        },
        where: whereClause,
        skip: offset,
        take: limit,
        order: {
          catalog_id: "ASC",
        },
      });

      // Transform the response
      const transformedImages = images.map((image) => ({
        catalogId: image.catalog_id,
        geometry: image.coverage_area,
        createdAt: image.created_at,
      }));

      return res.json({
        data: transformedImages,
        metadata: {
          total,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          limit,
        },
      });
    } catch (error) {
      console.error("Error fetching images:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getImageById(req: Request, res: Response) {
    try {
      // Validate parameters
      const paramsDto = plainToClass(GetImageParamsDto, req.params);
      const errors = await validate(paramsDto);

      if (errors.length > 0) {
        return res.status(400).json({
          error: "Validation failed",
          details: errors,
        });
      }

      const { id } = paramsDto;

      const image = await this.imageRepository.findOne({
        select: {
          catalog_id: true,
          coverage_area: true,
        },
        where: {
          catalog_id: id,
        },
      });

      if (!image) {
        return res.status(404).json({ error: "Image not found" });
      }

      // Transform the response
      const transformedImage = {
        catalogId: image.catalog_id,
        geometry: image.coverage_area,
      };

      return res.json({
        data: transformedImage,
      });
    } catch (error) {
      console.error("Error fetching image:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
