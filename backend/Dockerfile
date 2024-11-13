FROM node:22.11.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only the package.json and yarn.lock files first
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Ensure the container uses a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose the port that the Express.js app listens on
EXPOSE 3000

# Start the application using Yarn
CMD ["yarn", "start"]
