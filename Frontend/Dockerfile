# ---- Stage 1: Build ----
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ---- Stage 2: Serve with Nginx ----
FROM nginx:stable-alpine

# Copy built assets to Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Custom Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
