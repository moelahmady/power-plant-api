FROM node:20

WORKDIR /app

# Copy frontend package.json and package-lock.json
COPY frontend/package*.json ./frontend/

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm ci

# Copy the rest of the frontend source code
COPY frontend/ .

# Build the React app
RUN npm run build

# Copy backend package.json and package-lock.json
WORKDIR /app
COPY package*.json ./

# Install backend dependencies (both production and development)
RUN npm ci

# Copy the rest of the backend source code
COPY . .

# Build the TypeScript files
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Run the compiled server
CMD ["npm", "run", "start:prod"]