# Pull Official Base Image
FROM node:latest

# Set Working Directory
WORKDIR /app

# Install App Dependencies
COPY ["package.json", "package-lock.json", "/app/"]
RUN npm ci

# Add App
COPY [".", "/app"]

# Start App
CMD ["npm", "start"]
