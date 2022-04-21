# Un bot para descargar videos de youtube

## Requisitos

* [NodeJs](https://nodejs.org/en/)

## Instalación

### Instalación dependencias

Para instalar las dependencias de NodeJs, puedes ejecutar el siguiente comando desde la consola:

```console
npm install
```

#### Recomendación

Instalar nodemon: `npm install -g nodemon` luego con `nodemon ./index.js` lanzariamos la ejecución del bot.

### Creando el archivo de variables.yml

En la carpeta raíz, es necesario crear un archivo `variables.yml` para poder importar el token del bot que hemos creado.

```yaml
token : "Aqui-va-el-token"
```

## Ejecución

Para ejecutar el bot podemos usar uno de los dos comandos:

```console
node ./index.js
```

Solo si tenemos instalado nodemon usamos:

```console
nodemon ./index.js
```

O podemos ejecutar el entorno de desarrollo configurado previamente en el proyecto:

```console
npm run dev
```

Si tienes alguna duda puedes unirte a mi [canal de telegram](https://t.me/MrNizzyApps).
