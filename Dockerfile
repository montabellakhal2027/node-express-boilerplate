FROM node:18

WORKDIR /app

COPY package*.json ./

# Install netcat-openbsd and iputils-ping
RUN apt-get update && apt-get install -y netcat-openbsd iputils-ping && \
    npm install --fetch-timeout=300000 --fetch-retry-mintimeout=20000

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
