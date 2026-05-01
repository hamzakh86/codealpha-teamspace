# ---- Backend Dockerfile ----
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy application source
COPY . .

# Expose backend port
EXPOSE 3030

# Start the server
CMD ["node", "server.js"]
