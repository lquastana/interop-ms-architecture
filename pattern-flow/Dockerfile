# Utilisez une image de base compatible avec Node.js
FROM node:14-alpine

# Créez le répertoire de travail de l'application
WORKDIR /app

# Copiez les fichiers package.json et package-lock.json (si existant)
COPY package*.json ./

# Installez les dépendances de l'application
RUN npm install

# Copiez le reste des fichiers de l'application
COPY . .

# Exposez le port sur lequel votre application écoute (si nécessaire)
EXPOSE 1234

# Commande pour exécuter l'application
CMD [ "node", "build/index.js" ]