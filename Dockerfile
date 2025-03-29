# Build stage
FROM oven/bun:latest AS builder
WORKDIR /app
COPY package.json .env ./
RUN bun install
COPY . .
RUN bun run build

# Production stage
FROM oven/bun:latest
WORKDIR /app
COPY --from=builder /app/dist ./dist 
COPY --from=builder /app/package.json ./ 
COPY --from=builder /app/.env ./ 
COPY --from=builder /app/public ./public

RUN bun install --production

EXPOSE 8080
CMD ["bun", "run", "start"]