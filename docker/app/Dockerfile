# Stage 1: Build
FROM node:23.7-alpine AS build

# ENV NODE_OPTIONS="--max-old-space-size=3072"

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy package management files
COPY package.json pnpm-lock.yaml .npmrc ./

# Cache pnpm dependencies and install
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Copy all source files
COPY . .

# Build application
RUN pnpm run build

# Stage 2: Production
FROM node:23.7-alpine

WORKDIR /app

# Copy only build artifacts
COPY --from=build /app/.output ./
