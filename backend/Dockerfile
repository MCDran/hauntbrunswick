# Stage 1: Backend
FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY ./backend/package.json ./backend/package-lock.json ./
RUN npm install --production

# Copy the source code
COPY ./backend .

# Expose the backend port
EXPOSE 5000

# Command to start the Express app
CMD ["node", "dist/server.js"]
