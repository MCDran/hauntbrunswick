# Stage 1: Build the React app using Vite
FROM node:18-alpine AS build

WORKDIR /app

# Copy only package.json and lockfile first (for better caching)
COPY ./frontend/package.json ./frontend/package-lock.json ./

# Install both dependencies and devDependencies (uses caching)
RUN npm ci

# Copy the rest of the app files to the container
COPY ./frontend .

# Build the Vite app
RUN npm run build

# Stage 2: Serve the built app using a lightweight server
FROM node:18-alpine AS serve

WORKDIR /app

# Copy the build output from the build stage
COPY --from=build /app/dist ./dist

# Install serve globally
RUN npm install -g serve

# Expose the port your app will run on
EXPOSE 80

# Start the server
CMD ["serve", "-s", "./dist"]
