const { Telegraf } = require('telegraf')
const fs = require('fs')
const yaml = require('js-yaml')
const axios = require('axios')
const path = require('path')

const variables = yaml.load(fs.readFileSync('./variables.yml', 'utf8'))

const bot = new Telegraf(variables.token_2)

bot.start((context) => {
  context.reply('Bienvenido MrNizzy')
})

function validURL(str) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ) // fragment locator
  return !!pattern.test(str)
}

bot.on('text', (context) => {
  const text = context.message.text.split(' | ')
  console.log(validURL(text[0]))
  console.log(validURL(text[1]))

  if (validURL(text[0]) == true && text[1] !== null) {
    context.reply('Espera mientras se descarga el archivo...')

    async function downloadFile() {
      const filePath = path.resolve(__dirname, 'files', text[1])

      const writer = fs.createWriteStream(filePath)

      const response = await axios({
        url: text[0],
        method: 'GET',
        responseType: 'stream',
      })

      response.data.pipe(writer)

      return new Promise(() => {
        writer.on('finish', () => {
          context.reply('Archivo descargado ✅')
          context.telegram
            .sendDocument(context.from.id, `files/${text[1]}`)
            .catch((error) => {
              console.log(error)
            })
        })
        writer.on('error', () => {
          context.reply('❌ Hubo un error al descargar el archivo.')
        })
      })
    }

    downloadFile()
  } else {
    context.reply(
      `⚠ Verifica que los datos ingresados sean correctos. \nRecuerda que debes enviar la solicitud de esta manera: \nURL | nombre de archivo y extensión.`,
    )
  }
})

bot.launch()
