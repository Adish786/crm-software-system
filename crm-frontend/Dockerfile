FROM node:18-alpine AS builder
WORKDIR /app
# Install deps first (better caching)
COPY package*.json ./
RUN npm install
# Copy source code
COPY . .

RUN npm run build

FROM nginx:1.25-alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy build output to Nginx public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
