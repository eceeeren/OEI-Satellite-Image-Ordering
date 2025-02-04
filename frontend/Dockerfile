##################################################
# CLIENT SETUP
# 
# Guide: 'How to Dockerize a React App: A Step-by-Step Guide for Developers'
# Tutorial: https://www.docker.com/blog/how-to-dockerize-react-app/
##################################################

FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

EXPOSE 5173

# Configure Vite to accept external connections (added by Claude)
CMD ["npm", "run", "dev", "--", "--host"]