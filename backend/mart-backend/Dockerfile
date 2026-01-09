FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 3000

CMD ["node", "dist/main.js"]
