FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=production
EXPOSE 50054 3004
CMD ["node", "paymentMicroservice.js"]