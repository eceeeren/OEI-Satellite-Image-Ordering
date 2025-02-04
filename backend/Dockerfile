##################################################
# SERVER SETUP
# 
# Guide: 'step-by-step guide on how to set up a simple REST API using Node.js, PostgreSQL, Express, TypeScript, and Docker.'
# Tutorial: https://www.keralait.dev/blogs/76/step-by-step-guide-on-how-to-set-up-a-simple-rest-api-using-
##################################################

# Lighter node version to reduce container size
FROM node:20-slim

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code and TypeScript config
COPY tsconfig.json .
COPY src/ ./src/

# Build TypeScript code
RUN npm run build

# Remove development dependencies for smaller container size & reduced memory usage
RUN npm prune --production

EXPOSE 3000

CMD ["npm", "run", "serve"]