FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with increased timeout
RUN npm install --fetch-timeout=300000 --fetch-retry-mintimeout=20000

# Copy source code
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
