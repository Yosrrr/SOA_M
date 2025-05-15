# Utiliser une image Node.js comme base
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le contenu du répertoire actuel dans le conteneur
COPY . .

# Définir les variables d'environnement
ENV NODE_ENV=production
ENV PORT=50053
ENV HTTP_PORT=3003

# Exposer les ports utilisés par le microservice
EXPOSE 50053 3003

# Commande pour démarrer le microservice
CMD ["node", "parfumeMicroservice.js"]