# Un bot para descargar videos de youtube

## Requisitos

* [NodeJs](https://nodejs.org/en/)

## Instalación

### Instalación dependencias

Para instalar las dependencias de NodeJs, puedes ejecutar el siguiente comando desde la consola:

``npm install``

#### Recomendación

Instalar nodemon: `npm install -g nodemon` luego con `nodemon ./index.js` lanzariamos la ejecución del bot.

### Creando el archivo de variables.yml

En la carpeta raíz, es necesario crear un archivo variables.yml para poder importar el token del bot que hemos creado.

``token : "Aqui-va-el-token"``

## Ejecución

Para ejecutar el bot podemos usar uno de los dos comandos:

``node ./index.js``

``nodemon ./index.js`` ó ``npm run dev`` Solo si tenemos nodemon instalado.
