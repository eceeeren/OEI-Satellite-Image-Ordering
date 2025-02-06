import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSetup1708977600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable PostGIS
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS postgis`);

    // Create tables
    await queryRunner.query(`
      CREATE TABLE satellite_images (
        catalog_id VARCHAR(255) PRIMARY KEY,
        coverage_area GEOMETRY(Polygon, 4326),
        created_at TIMESTAMP NOT NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE orders (
        id VARCHAR(255) PRIMARY KEY,
        image_id VARCHAR(255) REFERENCES satellite_images(catalog_id),
        price VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL
      )
    `);

    // Insert initial data
    await queryRunner.query(`
      INSERT INTO satellite_images (catalog_id, coverage_area, created_at) VALUES
      (
        '103401008B2340',
        ST_SetSRID(ST_GeomFromGeoJSON('${JSON.stringify({
          type: "Polygon",
          coordinates: [
            [
              [11.55925345655993, 48.15521738088981],
              [11.558316603320833, 48.15253338175748],
              [11.562201667375433, 48.15208710581413],
              [11.566757031985645, 48.15342932937514],
              [11.566756986040389, 48.156020777339506],
              [11.55925345655993, 48.15521738088981],
            ],
          ],
        })}'), 4326),
        '2025-01-30T11:30:00Z'
      )
      /* Add other satellite image insertions similarly */
    `);

    await queryRunner.query(`
      INSERT INTO orders (id, image_id, price, created_at) VALUES
      (
        '6b8f84d-df4e-4d49-b662-bcde71a8764f',
        '103401008B2340',
        '299.99',
        '2025-01-30T10:00:00Z'
      ),
      (
        '604a4960-3140-403d-9681-571c2643761e',
        '103401009C2341',
        '449.99',
        '2025-01-30T11:30:00Z'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE orders`);
    await queryRunner.query(`DROP TABLE satellite_images`);
    await queryRunner.query(`DROP EXTENSION postgis`);
  }
}
