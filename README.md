# Listado de Bots para telegram

## Requisitos

* [NodeJs](https://nodejs.org/en/)

### Instalación

#### Instalación dependencias

Para instalar las dependencias de NodeJs, puedes ejecutar el siguiente comando desde la consola:

```console
npm install
```

#### Recomendación

Instalar nodemon: `npm install -g nodemon` luego con `nodemon ./index.js` lanzariamos la ejecución del bot.

### Creando el archivo de variables.yml

En la carpeta raíz, es necesario crear un archivo `variables.yml` para poder importar el token del bot que hemos creado.

```yaml
token : "Token del bot YouTube"
token_2: "Token del bot Uploader"
```

### Ejecución

Para ejecutar el bot podemos usar uno de los dos comandos:

```console
node ./<nombre del bot>.js
```

Solo si tenemos instalado nodemon usamos:

```console
nodemon ./<nombre del bot>.js
```

O podemos ejecutar el entorno de desarrollo configurado previamente en el proyecto:

```console
npm run dev
```

## Bot Youtube

El bot YouTube, te permite descargar videos de YouTube y reenviarlos automáticamente al usuario. Actualmente, solo soporta archivos menores a 50 Mbs, luego de ese límite puede haber errores como perdida de audio. En una próxima actualización se solucionará esa limitación. Únicamente requiere que el usuario envíe una URL. Puedes probar el bot demo: [@Nitube_bot](https://t.me/Nitube_bot)

## Bot Uploader

El bot uploader permite descargar archivos mediante una URL y un nombre de fichero, de la siguiente manera:

```text
https://example.com/image.png | Mi-imagen.png
```

El primer valor es el archivo a descargar, luego se hace un separador condicional ` | ` y después el nombre con extensión del archivo a subir.

### Nota

Este bot aún está en desarrollo. (Próximamente)

Si tienes alguna duda puedes unirte a mi [canal de telegram](https://t.me/MrNizzyApps).
