# Aplicación NodeJS conectada a BD MySQL RDS de AWS.

## Base de datos MySQl RDS en AWS
> Partimos que ya tienes una "BD MySQL" funcional y disponible con el "grupo de seguridad" para el acceso correspondiente.
> Más adelante incluiré como crearla via GUI o por IC.

## Instalar paquetes necesarios:
> Equipo usado en este ejemplo "Ubuntu 22.04.4 LTS"
```console
$ sudo apt-get update && sudo apt install nodejs npm
Validar versiones instaladas
$ node --version
v12.22.9
$ npm --version
8.5.1
```

## Crear carpeta "connect-nodejs-rds-mysql-aws" en "~/OSTECH/" y entrar al directorio
> Puedes establecer los nombres que mejor consideres.
```console
$ mkdir ~/OSTECH/connect-nodejs-rds-mysql-aws
$ cd ~/OSTECH/connect-nodejs-rds-mysql-aws
```

## Abrir Visual Studio
> En su defecto, usar tu editor de texto preferido (vim | nano | emacs)
```console
$ code .
```

## Iniciar estructura de la aplicación NodeJS
```console
$ npm init -y
```

## Instalar módulos necesarios:
```console
$ npm install express mysql dotenv
```

## Archivo "package.json" generado:
> El comando "npm init -y" utilizado previamente genera el archivo "package.json" e incluye las dependencias de los módulos a instalados.
```console
{
  "name": "connect-nodejs-rds-mysql-aws",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "mysql": "^2.18.1"
  }
}
```
## Crear archivo de variables ".env" 
> Nota: anexo datos ficticios para referencia, sustituir por los propios.
```console
$ touch .env
RDS_HOSTNAME='rdsmysqlmydbi.cxurrrrbvgthhf3w.us-east-1.rds.amazonaws.com'
RDS_PORT'=3306'
RDS_USERNAME='admin'
RDS_PASSWORD='@PAS5W0rd.4!!'
RDS_DATABASE='mysql'
```

## Crear archivo "index.js" para la aplicación NodeJS
```console
$ touch index.js

const dotenv = require('dotenv')
dotenv.config()
const express = require("express");
const router = express();
const mysql = require("mysql");
// const port = 8080;
var data;

const db = mysql.createConnection ({
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
});

db.connect(function(err) {
    if (err) throw err;
     console.log("Conectado a RDS")
    db.query("SELECT * FROM time_zone_name", function (err, result, fields) {
      if (err) throw err;
      data = result;
      // console.log(result);
    });
    // db.end();
  });

  router.get("/", function(req, res, next) {
      res.send(JSON.stringify(data));
    });
  module.exports = router;

  router.listen(8080, () => {
    console.log("Listening to requests on Port 8080")
})
```


## Crear archivo "Dockerfile" para construir la imagen Docker
```console
$ touch Dockerfile
```

```console
#Specify a base image
#Esta es una imagen docker ligera de node que tiene node y npm ya instalado
FROM node:alpine

#Specify a working directory
WORKDIR /usr/app/connect-nodejs-rds-mysql-aws

#Copy the project
COPY ./ ./

#Install dependencies
RUN npm install 
RUN npm install express mysql dotenv

#Default command
CMD ["npm","start"]
```

## Estructura final de archivos y carpetas:
> Resumen de archivos generados:
```console
$ ls -lart
-- jul 25 13:43 Dockerfile
-- jul 25 15:09 node_modules
-- jul 25 15:09 package.json
-- jul 25 17:25 package-lock.json
-- jul 25 18:35 .env
-- jul 25 19:12 index.js
-- jul 25 19:40 docker-compose.yml
-- jul 25 19:48 dc-build-image.yml
-- jul 25 20:04 .gitignore
-- jul 25 20:42 README.md
```

## Ejecutar aplicación NodeJS
```console
> Usar comando:
$ node index.js 
> O con este otro:
$ npm start run
> Salida:
...
> connect-nodejs-rds-mysql-aws@1.0.0 start
> node index.js "run"
> Listening to requests on Port 8080
> Conectado a RDS
...
```

## Construir imagen docker (local)
```console
$ docker build -t juliosanchez/connect-nodejs-rds-mysql-aws .
```

## Ver imagen creada
```console
$ docker images
REPOSITORY                                  TAG       IMAGE ID       CREATED         SIZE
juliosanchez/connect-nodejs-rds-mysql-aws   latest    755f31dfb218   3 minutes ago   155MB
```

## Levantar/Ejecutar la imagen (local):
> Utiliza la imagen local recien creada
```console
$ docker run -p 8080:8080 juliosanchez/connect-nodejs-rds-mysql-aws
```

## Consumir apliación NodeJS a través de navegador o curl
```console
$ curl http://localhost:8080
```

### Opcional: Subir imagen a docker hub.
> Autenticarse y cargar imagen
```console
$ docker login -u juliosanchez
Password: 
Login Succeeded

```console
> To push a new tag to this repository:
docker push juliosanchez/connect-nodejs-rds-mysql-aws:tagname
```

> Ahora podrá usar "​​​​​​​docker ​​​​​​pull juliosanchez/connect-nodejs-rds-mysql-aws" para disponer de la imagen pública.
> Imagen base disponible en Docker Hub. Base generada en esta guía.
```console
https://hub.docker.com/repository/docker/juliosanchez/connect-nodejs-rds-mysql-aws/general
```

### Opcional: crear archivo "docker-compose.yml"
> para usar imagen ubicada en https://hub.docker.com/
```console
version: "3.8"
services:
  connect-nodejs-rds-mysql-aws:
    container_name: connect-nodejs-rds-mysql-aws
    image: juliosanchez/connect-nodejs-rds-mysql-aws:latest
    restart: always
    environment:
      DB_HOST:    "${RDS_HOSTNAME}"
      DB_PORT:    "${RDS_PORT}"
      DB_USER:    "${RDS_USERNAME}"
      DB_PASSWORD: "${RDS_PASSWORD}"
      DB_NAME:    "${RDS_DATABASE}"
    ports:
      - "8080:8080" # Expose port 8080 on host
    networks:
      - connect-nodejs-rds-mysql-aws
networks: # Specify the network for bridging
  connect-nodejs-rds-mysql-aws:
    driver: bridge
```

### Levantar aplicación con "docker-compose"
```console
$ docker-compose -f docker-compose.yml up -d

Detener contenedores
```console
$ docker-compose -f docker-compose.yml down
```

### Opcional: construir imagen local
> Generar archivo "docker-compose.yml"
```console
$ touch dc-build-image.yml

version: "3.8"
services:
  connect-nodejs-rds-mysql-aws:
    build: . # Build image from local Dockerfile
    environment:
      DB_HOST:    "${RDS_HOSTNAME}"
      DB_PORT:    "${RDS_PORT}"
      DB_USER:    "${RDS_USERNAME}"
      DB_PASSWORD: "${RDS_PASSWORD}"
      DB_NAME:    "${RDS_DATABASE}"
    ports:
      - "8080:8080" # Expose port 3000 on host
    networks:
      - app-network
networks: # Specify the network for bridging
  app-network:
    driver: bridge
```


### Comandos complementarios:
```console
Estresar URL
$ ab -c 100 -n 5500 -r http://localhost:8080/

Iniciar o levantar contenedores:
docker-compose up -d

Detener imagenes:
docker-compose down

Eliminar todas las imagenes:
docker rm -f $(docker ps -a -q)

Eliminar todos los volumenes:
docker volume rm $(docker volume ls -q)

Eliminar imagenes:
docker image rm $(docker image ls -q)

Limpiar todo del sistema
docker system prune -a
```


### Comandos Git:
```console

> Excluir para "github" carpeta de módulos generada, evitar subir archivos y directorio innecesarios a github.
```console
echo "node_modules" >> .gitignore
```
git config --global user.email nocedajulio@gmail.com
git init
git add .
git commit -m "Aplicación NodeJS BD MySQL RDS en AWS"
git branch -M main
git remote add origin https://github.com/JulioESN/nodejs-rds-mysql-aws.git
git push -u origin main

git pull
git init [nombre del proyecto]
git branch <nombre-de-la-rama>
git branch -d <nombre-de-la-rama>
git clone <https://link-con-nombre-del-repositorio>

```


### URLS de referencias NodeJS:
```console
Node.js MySQL Select From
https://www.w3schools.com/nodejs/nodejs_mysql_select.asp

Node.js - MySQL Select From
https://www.tutorialspoint.com/nodejs/nodejs-mysql-select-from.htm

Deploy Node.js application with MySQL to AWS EC2 using Docker Compose
https://ljmocic.medium.com/deploy-node-js-application-with-mysql-database-to-aws-ec2-using-docker-compose-3e5034c034ce

Connect to MySQL on AWS RDS using NodeJS
https://www.youtube.com/watch?v=6Nt-Jl3CzxE&list=PLJ7Bv_j5EJJ9d969TZBlET9fZHW3Q74zL&index=5

Paquetes opcionales:
ref: npm install express morgan ejs mysql sequelize router start

```

> Saludos Julio Sánchez 