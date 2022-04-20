const { Telegraf, Markup } = require('telegraf')
const fs = require('fs')
const ytdl = require('ytdl-core')
const yaml = require('js-yaml')

const messages = yaml.load(fs.readFileSync('./messages.yml', 'utf8'))
const variables = yaml.load(fs.readFileSync('./variables.yml', 'utf8'))

const bot = new Telegraf(variables.token)

const AnimationUrl1 = 'https://media.giphy.com/media/ya4eevXU490Iw/giphy.gif'
const AnimationUrl2 = 'https://media.giphy.com/media/LrmU6jXIjwziE/giphy.gif'


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
      console.log(
        'ID: ' +
          context.from?.id +
          ' - Descargando el video - ' +
          info.videoDetails.title,
      )
      ytdl(URL, {
        format: 'mp4',
      }).pipe(fs.createWriteStream(`vid-${context.from?.id}.mp4`))
      context.reply(
        language === 'es'
          ? messages.es.videoDownloadSuccess
          : language === 'en'
          ? messages.en.videoDownloadSuccess
          : messages.en.videoDownloadSuccess,
      )
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

bot.command('enviar', (context) => {
  let language = context.from?.language_code
  let vidPath = `./vid-${context.from?.id}.mp4`
  let vidInfo = fs.statSync(vidPath)
  let fileSizeMB = vidInfo.size / (1024 * 1024)
  if (fileSizeMB < 50) {
    context.reply(
      language === 'es'
        ? messages.es.videoSend
        : language === 'en'
        ? messages.en.videoSend
        : messages.en.videoSend,
    )
    console.log(`ID: ${context.from?.id} - Enviando video.`)
    context.replyWithVideo({
      source: fs.createReadStream(`./vid-${context.from?.id}.mp4`),
      message: 'No olvides subscribirte a @MrNizzyApps',
    })
  } else if (fileSizeMB >= 50) {
    context.reply(
      language === 'es'
        ? messages.es.limitSize
        : language === 'en'
        ? messages.en.limitSize
        : messages.en.limitSize,
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

bot.command('edit_media', (ctx) =>
  ctx.replyWithAnimation(
    AnimationUrl1,
    Markup.inlineKeyboard([
      Markup.button.callback('Change media', 'swap_media'),
    ]),
  ),
)

bot.action('swap_media', (ctx) =>
  ctx.editMessageMedia({
    type: 'animation',
    media: AnimationUrl2,
  }),
)

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
