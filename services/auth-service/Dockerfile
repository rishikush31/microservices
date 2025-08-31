# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose the port your service runs on
EXPOSE 3001

# Run the service
CMD ["node", "index.js"]
