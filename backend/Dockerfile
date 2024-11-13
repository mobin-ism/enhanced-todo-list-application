FROM node:alpine
# Set the working directory to /app
WORKDIR /app
# Copy the package.json and package-lock.json files
COPY package*.json ./
# Install the dependencies
RUN npm install
# Copy the application code
COPY . .
# Build the application
# RUN npm run build

# Expose the port that the Express.js app will run on
EXPOSE 3000

# Start the Express.js app
CMD ["npm", "run", "dev"]
