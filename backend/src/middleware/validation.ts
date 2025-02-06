// src/middleware/validation.middleware.ts
import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

export const validateDto = (
  dtoClass: any,
  type: "body" | "query" | "params" = "body"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToClass(dtoClass, req[type]);
    const errors = await validate(dtoObject, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        })),
      });
    }

    req[type] = dtoObject;
    next();
  };
};
