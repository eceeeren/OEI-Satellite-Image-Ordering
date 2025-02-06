import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { Order } from "./Order";

@Entity("satellite_images")
export class SatelliteImage {
  @PrimaryColumn()
  catalog_id!: string;

  @Column({
    type: "geometry",
    spatialFeatureType: "Polygon",
    srid: 4326,
  })
  coverage_area!: object;

  @Column("timestamp")
  created_at!: Date;

  @OneToMany(() => Order, (order) => order.image)
  orders!: Order[];
}
