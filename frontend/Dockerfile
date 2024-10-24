# Stage 1: Build the React app using Vite
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm install --frozen-lockfile

# Copy the rest of the source files to the container
COPY ./frontend .

# Build the Vite app
RUN tsc -b && vite build
