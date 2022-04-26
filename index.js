const { Telegraf } = require('telegraf')
const fs = require('fs')
const ytdl = require('ytdl-core')
const yaml = require('js-yaml')
const Path = require('path')

const messages = yaml.load(fs.readFileSync('./messages.yml', 'utf8'))
const variables = yaml.load(fs.readFileSync('./variables.yml', 'utf8'))

const bot = new Telegraf(variables.token)

function fileExist(pathFile) {
  const path = Path.join(__dirname, pathFile)
  return fs.existsSync(path)
}

function downloadVideo(URL, context) {
  let language = context.from?.language_code
  ytdl.getBasicInfo(URL).then((info) => {
    console.log(
      'ID: ' +
      context.from?.id +
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

        context.reply(
          language === 'es'
            ? messages.es.videoDownloadSuccess
            : language === 'en'
              ? messages.en.videoDownloadSuccess
              : messages.en.videoDownloadSuccess,
        )

        if (fileSizeMB < 50 && fileSizeMB > 0) {
          context.reply(
            language === 'es'
              ? messages.es.videoSend
              : language === 'en'
                ? messages.en.videoSend
                : messages.en.videoSend,
          )

          console.log(`ID: ${context.from?.id} - Enviando video.`)

          context.replyWithVideo({
            source: fs.createReadStream(
              `./bot-youtube/${info.videoDetails.title}.mp4`,
            ),
            message: 'No olvides subscribirte a @MrNizzyApps',
          })
        } else if (fileSizeMB >= 50) {
          context.reply(
            language === 'es'
              ? messages.es.limitTelegram +
              `http://example.com/bot-youtube/${info.videoDetails.title}.mp4` // Modify your route
              : language === 'en'
                ? messages.en.limitTelegram
                : messages.en.limitTelegram,
          )
        } else {
          context.reply(
            language === 'es'
              ? messages.es.videoNoFound
              : language === 'en'
                ? messages.en.videoNoFound
                : messages.en.videoNoFound,
          )
        }
      })
      .on('error', () => {
        context.reply(
          language === 'es'
            ? messages.es.errorDownload
            : language === 'en'
              ? messages.en.errorDownload
              : messages.en.errorDownload,
        )
      })
  })
}

bot.command('start', (context) => {
  let language = context.from?.language_code
  context.reply(
    language === 'es'
      ? messages.es.start
      : language === 'en'
        ? messages.en.start
        : messages.en.start,
  )
})

bot.url((context) => {
  let language = context.from?.language_code
  let URL = context.message.text

  if (ytdl.validateURL(URL)) {
    context.reply(
      language === 'es'
        ? messages.es.videoProcess
        : language === 'en'
          ? messages.en.videoProcess
          : messages.en.videoProcess,
    )
    console.log(`ID: ${context.from?.id} - Procesando video...`)
    ytdl.getBasicInfo(URL).then((info) => {
      if (fileExist(`./bot-youtube/${info.videoDetails.title}.mp4`)) {
        let vidPath = `./bot-youtube/${info.videoDetails.title}.mp4`
        let vidInfo = fs.statSync(vidPath)
        let fileSizeMB = vidInfo.size / (1024 * 1024)
        if (fileSizeMB < 50 && fileSizeMB > 0) {
          context.reply(
            language === 'es'
              ? messages.es.videoSend
              : language === 'en'
                ? messages.en.videoSend
                : messages.en.videoSend,
          )

          console.log(`ID: ${context.from?.id} - Enviando video.`)

          context.replyWithVideo({
            source: fs.createReadStream(
              `./bot-youtube/${info.videoDetails.title}.mp4`,
            ),
            message: 'No olvides subscribirte a @MrNizzyApps',
          })
        } else if (fileSizeMB >= 50) {
          context.reply(
            language === 'es'
              ? messages.es.limitTelegram +
              `http://example.com/bot-youtube/${info.videoDetails.title}.mp4` // Modify your route
              : language === 'en'
                ? messages.en.limitTelegram
                : messages.en.limitTelegram,
          )
        } else {
          context.reply(
            language === 'es'
              ? messages.es.videoNoFound
              : language === 'en'
                ? messages.en.videoNoFound
                : messages.en.videoNoFound,
          )
        }
      } else {
        downloadVideo(URL, context)
      }
    })
  } else {
    console.log('URL incorrecta por usuario.')
    context.reply(
      language === 'es'
        ? messages.es.incorrectURL
        : language === 'en'
          ? messages.en.incorrectURL
          : messages.en.incorrectURL,
    )
  }
})

bot.command('help', (context) => {
  let language = context.from?.language_code
  context.reply(
    language === 'es'
      ? messages.es.help
      : language === 'en'
        ? messages.en.help
        : messages.en.help,
  )
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
