# Use Node.js as the base image
FROM node:22

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy the package.json file and install its dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Start the server
CMD ["pnpm", "dev"]