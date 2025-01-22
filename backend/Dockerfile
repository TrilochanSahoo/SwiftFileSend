FROM node:20.15.0

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

RUN npm install -g typescript

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]