# Use the official Node.js image as a base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install dependencies
RUN apk add --no-cache curl

# Download and install mkcert
RUN curl -fsSL -o /usr/local/bin/mkcert https://dl.filippo.io/mkcert/latest?for=linux/amd64 && \
    chmod +x /usr/local/bin/mkcert

# Install local CA
RUN mkcert -install

# Generate certificates
RUN mkcert localhost

# Create directories for certificates
RUN mkdir -p /app/dist/certs

# Move generated certificates to /app/dist/certs
RUN mv localhost.pem /app/dist/certs/localhost.pem && \
    mv localhost-key.pem /app/dist/certs/localhost-key.pem

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the TypeScript code
RUN npm run build

ENV PORT=3002
ENV POSTGRES_PORT=5432

# Expose port 3000 (or whichever port your app runs on)
EXPOSE ${PORT}

# Command to run the application
CMD ["npm", "start"]
