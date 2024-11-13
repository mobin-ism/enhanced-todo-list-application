# Build stage
FROM node:22.11.0-alpine AS builder

# Docker working directory
WORKDIR /app

# Set environment variables
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy only the package.json and yarn.lock files first
COPY package.json yarn.lock ./

# Install dependencies using Yarn (use root for now)
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Ensure the container uses a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Give the user proper permissions for the /app directory
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

# Build the app as the non-root user
RUN yarn build

# Set the base image for the production build
FROM nginx:alpine

# Copy the build files to the container from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the nginx configuration file to the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 8080

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]
