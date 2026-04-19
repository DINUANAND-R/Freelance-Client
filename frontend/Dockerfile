# ──────────────────────────────────────────────────────────────
# Stage 1: install dependencies
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ──────────────────────────────────────────────────────────────
# Stage 2: build the Vite app
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Accept the backend API URL at build time
# Override with: docker build --build-arg VITE_API_URL=https://api.yoursite.com
ARG VITE_API_URL=http://localhost:9000
ENV VITE_API_URL=$VITE_API_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ──────────────────────────────────────────────────────────────
# Stage 3: serve with nginx
# ──────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/

# Copy the built React app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Nginx runs in foreground
CMD ["nginx", "-g", "daemon off;"]
