# OEI-satellite-image-ordering

A full-stack REST API to fetch satellite images and create orders, using Node.js backend API, PostgreSQL/PostGIS database, and React frontend.

## Deployment URLs

- Client: https://oei-satellite-image-ordering-jmja.onrender.com
- Server: https://oei-satellite-image-ordering.onrender.com

## Stack

- **Frontend**: React with Vite
- **Backend**: Node.js/Express
- **Database**: PostgreSQL with PostGIS extension
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Docker and Docker Compose
- Node.js
- Git

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/eceeeren/OEI-Satellite-Image-Ordering.git
   cd OEI-Satellite-Image-Ordering
   ```

2. Start the application:
   ```bash
   docker-compose up --build
   ```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432

## Project Structure

```
├── frontend/          # React Vite frontend
├── backend/           # Node.js API
├── docker-compose.yml # Docker composition
└── .env              # Environment variables
```

## Development

- Frontend hot-reload is enabled
- Database persists data in a Docker volume
- PostGIS extension is available for geospatial queries
- Initial database schema is loaded from `backend/init.sql`

## API Endpoints

### Images Endpoints

#### List Images

- **GET** `/images`
- **Description**: Retrieve a paginated list of satellite images
- **Query Parameters**:
  - `page` (optional, default: 1): Page number for pagination
  - `limit` (optional, default: 5): Number of items per page
  - `startDate` (optional): Filter images created on or after this date
  - `endDate` (optional): Filter images created on or before this date
  - `area` (optional): GeoJSON to filter images within a specific geographic area

**Example Request**:

```
GET /images?page=1&limit=5&startDate=2025-01-01T00:00:00Z&endDate=2025-02-01T23:59:59Z
```

**Response**:

```json
{
  "images": [
    {
      "catalogId": "103401008B2340",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [11.55925345655993, 48.15521738088981],
            [11.558316603320833, 48.15253338175748],
            ...
          ]
        ]
      },
      "createdAt": "2025-01-30T11:30:00Z"
    }
  ],
  "total": 6,
  "currentPage": 1,
  "totalPages": 2
}
```

#### Get Specific Image

- **GET** `/images/{id}`
- **Description**: Retrieve details of a specific satellite image
- **Path Parameters**:
  - `id`: Unique catalog ID of the satellite image

**Example Request**:

```
GET /images/103401008B2340
```

**Response**:

```json
{
  "catalogId": "103401008B2340",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [11.55925345655993, 48.15521738088981],
        [11.558316603320833, 48.15253338175748],
        ...
      ]
    ]
  }
}
```

### Orders Endpoints

#### List Orders

- **GET** `/orders`
- **Description**: Retrieve a paginated list of orders
- **Query Parameters**:
  - `page` (optional, default: 1): Page number for pagination
  - `limit` (optional, default: 5): Number of items per page
  - `minPrice` (optional): Minimum price filter
  - `maxPrice` (optional): Maximum price filter
  - `startDate` (optional): Filter orders created on or after this date
  - `endDate` (optional): Filter orders created on or before this date

**Example Request**:

```
GET /orders?page=1&limit=5&minPrice=200&maxPrice=500
```

**Response**:

```json
{
  "orders": [
    {
      "orderId": "6b8f84d-df4e-4d49-b662-bcde71a8764f",
      "imageId": "103401008B2340",
      "price": 299.99,
      "createdAt": "2025-01-30T10:00:00Z"
    }
  ],
  "total": 2,
  "currentPage": 1,
  "totalPages": 1
}
```

#### Create Order

- **POST** `/orders`
- **Description**: Create a new order for a satellite image
- **Request Body**:
  - `imageId` (required): Catalog ID of the satellite image
  - `price` (required): Price of the order

**Example Request Body**:

```json
{
  "imageId": "103401009C2343",
  "price": 399.99
}
```

**Response**:

```json
{
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "imageId": "103401009C2343",
  "price": 399.99,
  "createdAt": "2025-02-15T14:30:00Z"
}
```

### Error Handling

- `400 Bad Request`: Invalid input parameters
- `404 Not Found`: Requested resource not found
- `500 Internal Server Error`: Server-side error

### Notes

- Dates should be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)
- Prices are in decimal format
- All endpoints support pagination
