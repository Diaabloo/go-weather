# Docker Setup Guide

This guide explains how to build and run the Weather App using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for easier management)

## Building the Docker Image

To build the Docker image, run the following command in the project root:

\`\`\`bash
docker build -t weather-app .
\`\`\`

**Explanation:**
- `docker build`: Command to build a Docker image
- `-t weather-app`: Tags the image with the name "weather-app"
- `.`: Uses the current directory as the build context

## Running the Container

### Basic Run

\`\`\`bash
docker run -p 3000:3000 weather-app
\`\`\`

**Explanation:**
- `docker run`: Command to run a container from an image
- `-p 3000:3000`: Maps port 3000 from the container to port 3000 on your host
- `weather-app`: The name of the image to run

### Run with Environment Variables

If you need to pass environment variables (like API keys):

\`\`\`bash
docker run -p 3000:3000 \
  -e OPENWEATHER_API_KEY=your_api_key_here \
  weather-app
\`\`\`

**Explanation:**
- `-e`: Sets an environment variable in the container
- `OPENWEATHER_API_KEY=your_api_key_here`: The environment variable and its value

### Run in Detached Mode

\`\`\`bash
docker run -d -p 3000:3000 --name weather-app-container weather-app
\`\`\`

**Explanation:**
- `-d`: Runs the container in detached mode (background)
- `--name weather-app-container`: Gives the container a specific name

## Docker Compose (Optional)

Create a `docker-compose.yml` file for easier management:

\`\`\`yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - OPENWEATHER_API_KEY=${OPENWEATHER_API_KEY}
    restart: unless-stopped
\`\`\`

Then run:

\`\`\`bash
docker-compose up -d
\`\`\`

## Useful Docker Commands

### View Running Containers
\`\`\`bash
docker ps
\`\`\`

### View Container Logs
\`\`\`bash
docker logs weather-app-container
\`\`\`

### Stop Container
\`\`\`bash
docker stop weather-app-container
\`\`\`

### Remove Container
\`\`\`bash
docker rm weather-app-container
\`\`\`

### Remove Image
\`\`\`bash
docker rmi weather-app
\`\`\`

## Dockerfile Explanation

The Dockerfile uses a **multi-stage build** approach:

1. **Stage 1 (deps)**: Installs dependencies
   - Uses `node:20-alpine` for a smaller image size
   - Copies only package files and installs dependencies

2. **Stage 2 (builder)**: Builds the application
   - Copies dependencies from the previous stage
   - Copies all source files
   - Builds the Next.js application

3. **Stage 3 (runner)**: Creates the production image
   - Uses a minimal Node.js image
   - Creates a non-root user for security
   - Copies only the necessary built files
   - Exposes port 3000
   - Runs the application as a non-root user

This approach results in a smaller, more secure production image.

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, map to a different port:
\`\`\`bash
docker run -p 8080:3000 weather-app
\`\`\`
Then access the app at `http://localhost:8080`

### Container Exits Immediately
Check the logs:
\`\`\`bash
docker logs weather-app-container
\`\`\`

### Build Fails
Make sure you have the latest Docker version and sufficient disk space.
