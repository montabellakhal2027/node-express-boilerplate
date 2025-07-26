FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --fetch-timeout=300000 --fetch-retry-mintimeout=20000

# Copy source code
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
