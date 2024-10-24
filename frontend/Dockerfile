# Stage 1: Build the React app using Vite
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY ./frontend/package.json ./frontend/package-lock.json ./

# Install both dependencies and devDependencies
RUN npm install --frozen-lockfile --production=false

# Explicitly install TypeScript (troubleshooting step)
RUN npm install typescript

# Find the TypeScript installation path (troubleshooting step)
RUN find / -name "tsc"

# Check TypeScript version (troubleshooting step)
RUN tsc --version

# Copy the rest of the source files to the container (including tsconfig.json)
COPY ./frontend .

# Build the Vite app
RUN tsc -b && vite build

# Stage 2: Serve the built app using a lightweight server
FROM node:18-alpine AS serve

WORKDIR /app

# Copy the build output from the build stage
COPY --from=build /app/dist ./dist

# Install serve
RUN npm install -g serve

# Expose the port your app will run on
EXPOSE 80

# Start the server
CMD ["serve", "-s", "./dist"]