# 1. Använd Node 22
FROM node:22

# 2. Ange arbetsmapp
WORKDIR /app

# 3. Kopiera package.json och installera dependencies
COPY package*.json ./
RUN npm install

# 4. Kopiera resten av frontend-projektet
COPY . .

# 5. Exponera Vite dev-porten
EXPOSE 5173

# 6. Starta Vite dev-servern
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
