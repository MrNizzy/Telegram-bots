/* Importing the modules. */
const { Telegraf } = require('telegraf')
const fs = require('fs')
const ytdl = require('ytdl-core')
const yaml = require('js-yaml')
const Path = require('path')
const translate = require('translate-google')

/* It's importing the modules, and it's creating the bot. */
const messages = yaml.load(fs.readFileSync('./messages.yml', 'utf8'))
const variables = yaml.load(fs.readFileSync('./variables.yml', 'utf8'))
const bot = new Telegraf(variables.token)
const ctx = bot.context

/**
 * It checks if a file exists in the current directory.
 * @param pathFile - The path to the file you want to check.
 * @returns A boolean value.
 */
function fileExist(pathFile) {
  const path = Path.join(__dirname, pathFile)
  return fs.existsSync(path)
}

/**
 * It downloads a video from YouTube, then checks if the video is less than 50MB, if it is, it sends it
 * to the user, if it's not, it sends a link to the video.
 * @param URL - The URL of the video you want to download.
 */
function downloadVideo(URL) {
  let language = ctx.from?.language_code
  ytdl.getBasicInfo(URL).then((info) => {
    console.log(
      'ID: ' +
        ctx.from?.id +
        ' - Descargando el video - ' +
        info.videoDetails.title,
    )
    ytdl(URL, {
      format: 'mp4',
    })
      .pipe(
        fs.createWriteStream(`./bot-youtube/${info.videoDetails.title}.mp4`),
      )
      .on('finish', () => {
        let vidPath = `./bot-youtube/${info.videoDetails.title}.mp4`
        let vidInfo = fs.statSync(vidPath)
        let fileSizeMB = vidInfo.size / (1024 * 1024)

        translate(messages.es.videoDownloadSuccess, {
          from: 'es',
          to: language,
        })
          .then((res) => {
            ctx.reply(res)
          })
          .catch((err) => {
            console.error(err)
            ctx.reply(messages.error.errorLanguage)
          })

        if (fileSizeMB < 50 && fileSizeMB > 0) {
          translate(messages.es.videoSend, {
            from: 'es',
            to: language,
          })
            .then((res) => {
              ctx.reply(res)
            })
            .catch((err) => {
              console.error(err)
              ctx.reply(messages.error.errorLanguage)
            })

          console.log(`ID: ${ctx.from?.id} - Enviando video.`)

          ctx.replyWithVideo({
            source: fs.createReadStream(
              `./bot-youtube/${info.videoDetails.title}.mp4`,
            ),
            message: 'No olvides subscribirte a @MrNizzyApps',
          })
        } else if (fileSizeMB >= 50) {
          translate(messages.es.limitTelegram, {
            from: 'es',
            to: language,
          })
            .then((res) => {
              ctx.reply(
                res +
                  `http://example.com/bot-youtube/${info.videoDetails.title}.mp4`,
              )
            })
            .catch((err) => {
              console.error(err)
              ctx.reply(messages.error.errorLanguage)
            })
        } else {
          translate(messages.es.videoNoFound, {
            from: 'es',
            to: language,
          })
            .then((res) => {
              ctx.reply(res)
            })
            .catch((err) => {
              console.error(err)
              ctx.reply(messages.error.errorLanguage)
            })
        }
      })
      .on('error', () => {
        translate(messages.es.errorDownload, {
          from: 'es',
          to: language,
        })
          .then((res) => {
            ctx.reply(res)
          })
          .catch((err) => {
            console.error(err)
            ctx.reply(messages.error.errorLanguage)
          })
      })
  })
}

/* It's a command that sends a message to the user. */
bot.command('start', (context) => {
  let language = context.from?.language_code
  translate(messages.es.start, { from: 'es', to: language })
    .then((res) => {
      context.reply(res)
    })
    .catch((err) => {
      console.error(err)
      context.reply(messages.error.errorLanguage)
    })
})

/* It's a function that checks if the URL is valid, if it is, it checks if the video is already
downloaded, if it is, it sends it to the user, if it's not, it downloads it. */
bot.url((context) => {
  let language = context.from?.language_code
  let URL = context.message.text

  if (ytdl.validateURL(URL)) {
    translate(messages.es.videoProcess, { from: 'es', to: language })
      .then((res) => {
        context.reply(res)
      })
      .catch((err) => {
        console.error(err)
        context.reply(messages.error.errorLanguage)
      })

    console.log(`ID: ${context.from?.id} - Procesando video...`)
    ytdl.getBasicInfo(URL).then((info) => {
      if (fileExist(`./bot-youtube/${info.videoDetails.title}.mp4`)) {
        let vidPath = `./bot-youtube/${info.videoDetails.title}.mp4`
        let vidInfo = fs.statSync(vidPath)
        let fileSizeMB = vidInfo.size / (1024 * 1024)
        if (fileSizeMB < 50 && fileSizeMB > 0) {
          translate(messages.es.videoSend, { from: 'es', to: language })
            .then((res) => {
              context.reply(res)
            })
            .catch((err) => {
              console.error(err)
              context.reply(messages.error.errorLanguage)
            })

          console.log(`ID: ${context.from?.id} - Enviando video.`)

          context.replyWithVideo({
            source: fs.createReadStream(
              `./bot-youtube/${info.videoDetails.title}.mp4`,
            ),
            message: 'No olvides subscribirte a @MrNizzyApps',
          })
        } else if (fileSizeMB >= 50) {
          translate(messages.es.limitTelegram, { from: 'es', to: language })
            .then((res) => {
              context.reply(res)
            })
            .catch((err) => {
              console.error(err)
              context.reply(messages.error.errorLanguage)
            })
        } else {
          translate(messages.es.videoNoFound, { from: 'es', to: language })
            .then((res) => {
              context.reply(res)
            })
            .catch((err) => {
              console.error(err)
              context.reply(messages.error.errorLanguage)
            })
        }
      } else {
        downloadVideo(URL)
      }
    })
  } else {
    console.log('URL incorrecta por usuario.')
    translate(messages.es.incorrectURL, { from: 'es', to: language })
      .then((res) => {
        context.reply(res)
      })
      .catch((err) => {
        console.error(err)
        context.reply(messages.error.errorLanguage)
      })
  }
})

/* It's a command that sends a message to the user. */
bot.command('help', (context) => {
  let language = context.from?.language_code
  translate(messages.es.help, { from: 'es', to: language })
    .then((res) => {
      context.reply(res)
    })
    .catch((err) => {
      console.error(err)
      context.reply(messages.error.errorLanguage)
    })
})

/* It's starting the bot. */
bot.launch()

/* It's a function that stops the bot when you press Ctrl + C. */
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
