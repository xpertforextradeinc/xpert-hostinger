# --- Stage 1: Build the App ---
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy configuration files first (for better caching)
COPY package*.json ./
COPY tsconfig.json ./
# Copy the prisma folder so we can generate the client
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# CRITICAL STEP: Generate the Prisma Client
# This fixes the "Prisma Generate" missing issue
RUN npx prisma generate

# Copy the rest of your source code
COPY . .

# Build the TypeScript code (creates the dist folder)
RUN npm run build

# --- Stage 2: Run the App ---
FROM node:20-alpine

WORKDIR /app

# Copy built files and dependencies from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Expose the port your app runs on (usually 3000 or 8080)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
