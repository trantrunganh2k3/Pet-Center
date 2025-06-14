# ---------- 1. Cài dépendency ----------
FROM node:18-alpine AS deps
WORKDIR /app

# Chỉ copy file khai báo để cache cài đặt
COPY package*.json ./
RUN npm ci --frozen-lockfile

# ---------- 2. Build ----------
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- 3. Image runtime ----------
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Chỉ copy những gì cần để chạy
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 3000
CMD ["npm","start"]
    