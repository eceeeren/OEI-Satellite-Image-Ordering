export interface DatabaseConfig {
  user: string;
  password: string;
  host: string;
  database: string;
  port: number;
}

export interface Geometry {
  type: "Polygon";
  coordinates: number[][][];
}

export interface ImageData {
  catalogId: string;
  geometry: Geometry;
}

export interface OrderData {
  orderId: string;
  imageId: string;
  price: string;
  createdAt: string;
}
