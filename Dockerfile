#Specify a base image
#Esta es una imagen docker ligera de node que tiene node y npm ya instalado
FROM node:alpine

#Specify a working directory
WORKDIR /usr/app/connect-nodejs-rds-mysql-aws

#Copy the project
COPY ./ ./

#Install dependencies
RUN npm install 
RUN npm install express mysql

#Default command
CMD ["npm","start"]