ARG NODE_VERSION=22

# Create build stage
FROM node:${NODE_VERSION}-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml files to the working directory
COPY ./nuxt/package.json /app/
COPY ./nuxt/package-lock.json /app/

RUN apk add git

## Install dependencies
RUN npm ci

# Copy the rest of the application files to the working directory
COPY ./nuxt /app

# Pass the environment variables to the build
ARG NUXT_BASE_URL
ARG NUXT_PUBLIC_BASE_URL
ARG NUXT_PUBLIC_MAIL
ARG NUXT_PUBLIC_PHONE

# Set the environment variables for the build process
ENV NUXT_BASE_URL=${NUXT_BASE_URL}
ENV NUXT_PUBLIC_BASE_URL=${NUXT_PUBLIC_BASE_URL}
ENV NUXT_PUBLIC_MAIL=${NUXT_PUBLIC_MAIL}
ENV NUXT_PUBLIC_PHONE=${NUXT_PUBLIC_PHONE}

# Build the application
RUN npm run build

# Create a new stage for the production image
FROM node:${NODE_VERSION}-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the output from the build stage to the working directory
COPY --from=build /app/.output /app

# Define environment variables
ENV HOST=0.0.0.0 NODE_ENV=production

# Expose the port the application will run on
EXPOSE 3000

# Start the application
CMD ["node","/app/server/index.mjs"]