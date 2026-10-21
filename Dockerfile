# --- Stage 1: Build the application ---
FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Serve the application with Nginx ---
FROM nginx:alpine

# Copy the built files from the builder stage to Nginx's serve directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the standard HTTP port
EXPOSE 8081

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
