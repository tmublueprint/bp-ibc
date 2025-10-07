FROM node:20-alpine

WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY src ./src
COPY tsconfig.json ./
RUN npm run build

# Expose port and start
EXPOSE 3001
CMD ["npm", "start"]