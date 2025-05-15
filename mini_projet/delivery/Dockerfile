FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le contenu du répertoire actuel dans le conteneur
COPY . .

# Définir la variable d'environnement NODE_ENV pour indiquer que nous sommes en production
ENV NODE_ENV=production

# Exposer les ports utilisés par le microservice
EXPOSE 50055 3005

# Commande pour démarrer le microservice
CMD ["node", "deliveryMicroservice.js"]