import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { SatelliteImage } from "./SatelliteImage";

@Entity("orders")
export class Order {
  @PrimaryColumn()
  id!: string;

  @Column()
  image_id!: string;

  @Column()
  price!: string;

  @Column("timestamp")
  created_at!: Date;

  @ManyToOne(() => SatelliteImage, (image) => image.orders)
  @JoinColumn({ name: "image_id" })
  image!: SatelliteImage;
}
