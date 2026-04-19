# ──────────────────────────────────────────────────────────────
# Stage 1: build dependencies
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Copy manifests first for layer caching
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm ci --omit=dev

# ──────────────────────────────────────────────────────────────
# Stage 2: production image
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY . .

# Create upload directories so volumes mount cleanly
RUN mkdir -p uploads/freelancers uploads/resumes uploads/freelancerPosts \
    && chown -R appuser:appgroup /app

USER appuser

EXPOSE 9000

# Health check — polls the server every 30s
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget -qO- http://localhost:9000/health || exit 1

CMD ["node", "index.js"]
