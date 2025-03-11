# Primera etapa: Instalación de dependencias
# ====================================================================================================
FROM node:20.13.1-alpine as dev-deps

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de configuración de dependencias
COPY package.json package-lock.json ./

# Instalar las dependencias de desarrollo
RUN npm ci


# Segunda etapa: Realización de pruebas
# ====================================================================================================
FROM node:20.13.1-alpine as build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar todos los archivos del proyecto
COPY . .

# Copiar las dependencias instaladas desde la etapa anterior
COPY --from=dev-deps /app/node_modules ./node_modules

# Realizar el testing (comentado si no es necesario)
RUN npm run test


# Tercera etapa: Instalación de dependencias de producción
# ====================================================================================================
FROM node:20.13.1-alpine as prod-deps

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar las dependencias desde la etapa de desarrollo
COPY --from=dev-deps /app/node_modules ./node_modules

# Instalar solo las dependencias de producción
RUN npm prune --production


# Cuarta etapa: Construcción final
# ====================================================================================================
FROM node:20.13.1-alpine as final-build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar solo los archivos necesarios para la construcción
COPY . .

# Instalar typescript solo para la construcción
RUN npm install typescript

# Definir argumentos de compilación
ARG VITE_API_BLIKON_AUTH
ARG VITE_BLIKON_AUTH_TOKEN
ARG VITE_ENVIRONMENT


# Definir variables de entorno
ENV VITE_API_BLIKON_AUTH=${VITE_API_BLIKON_AUTH} \
    VITE_BLIKON_AUTH_TOKEN=${VITE_BLIKON_AUTH_TOKEN} \
    VITE_ENVIRONMENT=${VITE_ENVIRONMENT}

# Construir la aplicación
RUN npm run build


# Quinta etapa: Correr la aplicación
# ====================================================================================================
FROM nginx:1.27.0 as prod

WORKDIR /app

# Copiar los archivos construidos desde la etapa de construcción
COPY --from=final-build /app/dist /usr/share/nginx/html

# Reemplazo la configuración actual de nginx con la propia
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

# Exponer el puerto 80
EXPOSE 80

# Establecer el comando de inicio de la aplicación
CMD ["nginx", "-g", "daemon off;"]
