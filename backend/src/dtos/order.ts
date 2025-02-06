import { IsNotEmpty, IsUUID, IsNumber, Min, IsString } from "class-validator";

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  imageId!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price!: number;
}

export class GetOrdersQueryDto {
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsNumber()
  @Min(1)
  limit: number = 5;

  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsNumber()
  maxPrice?: number;

  @IsString()
  startDate?: string;

  @IsString()
  endDate?: string;
}
