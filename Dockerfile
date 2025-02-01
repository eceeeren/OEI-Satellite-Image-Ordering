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

# Remove development dependencies
RUN npm prune --production

EXPOSE 3000

CMD ["npm", "run", "serve"]