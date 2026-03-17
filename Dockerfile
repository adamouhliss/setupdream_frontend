# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Provide a dummy VITE_API_URL during build just in case, though usually set at runtime
ENV VITE_API_URL=/api/v1
RUN npm run build

# Serve stage
FROM nginx:alpine
# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port (Easypanel will map this)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
