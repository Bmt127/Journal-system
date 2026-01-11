# ===== Build stage =====
FROM node:22 AS build

WORKDIR /app

# Definiera ARG för varje variabel du vill kunna skicka in vid bygget
ARG VITE_USER_SERVICE_URL
ARG VITE_JOURNAL_SERVICE_URL
ARG VITE_MESSAGE_SERVICE_URL
ARG VITE_SEARCH_SERVICE_URL
ARG VITE_IMAGE_SERVICE_URL
ARG VITE_KEYCLOAK_URL

# Gör dessa tillgängliga som miljövariabler under 'npm run build'
ENV VITE_USER_SERVICE_URL=$VITE_USER_SERVICE_URL
ENV VITE_JOURNAL_SERVICE_URL=$VITE_JOURNAL_SERVICE_URL
ENV VITE_MESSAGE_SERVICE_URL=$VITE_MESSAGE_SERVICE_URL
ENV VITE_SEARCH_SERVICE_URL=$VITE_SEARCH_SERVICE_URL
ENV VITE_IMAGE_SERVICE_URL=$VITE_IMAGE_SERVICE_URL
ENV VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL

COPY package*.json ./
RUN npm install

COPY . .
# Här bränns variablerna in i koden i /dist mappen
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