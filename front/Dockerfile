FROM node:lts-alpine3.17 

ENV TZ="America/Lima"

RUN apk update && apk add --no-cache tzdata

WORKDIR /usr/src/app
COPY ./app ./

RUN npm install
# RUN npm install --legacy-peer-deps

RUN npm install -g @angular/cli

EXPOSE 4200
ENTRYPOINT [ "ng", "serve", "--host", "0.0.0.0", "--port", "4200" ]


# Usa una imagen base de Node.js
# FROM node:lts-alpine3.17

# # Establece la zona horaria
# ENV TZ="America/Lima"

# # Instala tzdata, Python, make, gcc, g++ para construir módulos nativos
# RUN apk update && apk add --no-cache \
#     tzdata \
#     python3 \
#     py3-pip \
#     make \
#     g++ \
#     gcc \
#     bash

# # Fuerza la creación del enlace simbólico
# RUN ln -sf /usr/bin/python3 /usr/bin/python

# # Establece el directorio de trabajo en el contenedor
# WORKDIR /usr/src/app

# # Copia el código del proyecto al contenedor
# COPY ./app ./ 

# # Instala las dependencias de Node.js
# RUN npm install

# # Instala Angular CLI globalmente
# RUN npm install -g @angular/cli

# # Expone el puerto 4200 para la aplicación Angular
# EXPOSE 4200

# # Comando para ejecutar la aplicación Angular
# ENTRYPOINT [ "ng", "serve", "--host", "0.0.0.0", "--port", "4200" ]