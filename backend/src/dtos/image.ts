import {
  IsOptional,
  IsNumber,
  Min,
  IsString,
  IsNotEmpty,
} from "class-validator";
import { Type } from "class-transformer";

export class GetImagesQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit: number = 5;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  area?: string;
}

export class GetImageParamsDto {
  @IsString()
  @IsNotEmpty()
  id!: string;
}
