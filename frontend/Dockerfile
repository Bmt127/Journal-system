# ===== Build stage =====
FROM node:22 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ===== Runtime stage =====
FROM nginx:alpine

# Ta bort default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Lägg till egen config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiera byggda filer
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
