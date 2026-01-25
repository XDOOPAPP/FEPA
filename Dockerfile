# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --prefer-offline --no-audit

# Copy source code
COPY . .

# Set build environment variables
ARG VITE_API_BASE_URL=http://76.13.21.84:3000/api/v1
ARG VITE_SOCKET_URL=http://76.13.21.84:3102
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

# Build the application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80 || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
