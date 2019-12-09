# Assist

# Установка node
https://nodejs.org/en/

# Обновление node
node --version
sudo npm cache clean -f
sudo npm install n -g
# for the latest stable version:
# sudo n stable
# for the latest version:
sudo n latest

# Создание нового проекта

Server
# cd Project directory
cd /Volumes/Exchange/Project/server 
# Инициализация нового проекта 
npm init
# После ответа на вопросы в директории должен появиться файл package.json следующего содержания (если чего-то не хватает, то это можно добавить вручную)
{
  "name": "server",
  "description": "GraphQL Apollo Server",
  "version": "0.0.1",
  "private": true,
  "author": "R&D",
  "license": "ISC",
  "keywords": [
    "express",
    "apollo",
    "graphql",
    "jwt",
    "mongodb"
  ],
  "main": "server.js",
  "scripts": {
    "start": "nodemon -r esm ./index.js",
    "update": "ncu -u && npm install"
  },
  "repository": {
    "type": "git",
    "url": "none"
  }
}
# Для того, чтобы не перезапускать проект после каждого редактирования файлов имеется специальный пакет nodemon, который самостоятельно следит за изменениями в проекте, и, если изменения происходят, то происходит автоматический перезапуск проекта
# Установка nodemon
npm install --save-dev nodemon
# После установки пакета, в файл package.json следует добавить следующий script:
  "scripts": {
    "start": "nodemon ./server.js",
  }
# Запуск проекта производится коммандой:
# npm run start

# Изначально в node не работает синтаксис import для модулей (так как это новый функционал) для того, чтобы import заработал нужно установить модуль esm
npm install --save-dev esm
# После установки пакета, в файл package.json следует добавить следующий script:
  "scripts": {
    "start": "nodemon -r esm ./server.js",
  }
# Запуск проекта производится коммандой:
# npm run start

# enable dependencies autoupdate
npm install --save-dev npm-check-updates
# После установки пакета, в файл package.json следует добавить следующий script:
  "scripts": {
    "update": "ncu -u && npm install"
  }
# Обновления всех dependencies проекта производятся коммандой:
# npm run update

# Установка связки Apollo Server и Express
# https://www.apollographql.com/docs/apollo-server/essentials/server/#ssltls-support
# apollo-server-express
npm install --save apollo-server graphql
npm install --save express apollo-server-express
# Включение ssl в express
# ssl
# https://timonweb.com/posts/running-expressjs-server-over-https/
mkdir ssl
cd ssl
# generate cert.pem and key.pem
openssl req -nodes -new -x509 -keyout server.key -out server.cert
const server = https.createServer(
  {
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.cert'),
  },
  app,
);

npm install --save jsonwebtoken
npm install --save graphql-import
npm install --save bcryptjs
npm install --save mongoose