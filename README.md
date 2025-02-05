# OEI-satellite-image-ordering

A full-stack REST API to fetch satellite images and create orders, using Node.js backend API, PostgreSQL/PostGIS database, and React frontend.

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
