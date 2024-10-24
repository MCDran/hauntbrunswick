# Stage 1: Build the React app using Vite
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY ./frontend/package.json ./frontend/package-lock.json ./

# Install both dependencies and devDependencies
RUN npm install --frozen-lockfile --production=false

# Copy the rest of the source files to the container (including tsconfig.json)
COPY ./frontend .

# Build the Vite app
RUN tsc -b && vite build

# ... rest of your Dockerfile ...