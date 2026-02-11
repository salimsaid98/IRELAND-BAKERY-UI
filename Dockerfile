FROM node:20

WORKDIR /app

# Install Ionic CLI v7.x globally
RUN npm install -g @ionic/cli@^7

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

EXPOSE 8100

# Run dev server
CMD ["ionic", "serve", "--host", "0.0.0.0", "--port", "8100", "--no-open"]
