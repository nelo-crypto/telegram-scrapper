import axios from 'axios'
import cheerio from 'cheerio'

const telegrams = [
    {
        name: 'lobsters_daily',
        url: 'https://t.me/s/lobsters_daily',
        previousText: null
    }
    /* Add more here */
]

async function run() {
    for (let telegramIndex = 0; telegramIndex < telegrams.length; ++telegramIndex) {
        console.log('Processing ' + telegrams[telegramIndex].name)

        await axios.get(telegrams[telegramIndex].url)
            .then(async (response) => {
                const $ = cheerio.load(response.data)

                const lastText = $('div.tgme_widget_message_text')
                    .last()
                    .text()

                const followers = $('div.tgme_header_counter')
                    .text()

                const metaId = $('div.tgme_widget_message')
                    .last()
                    .data('post')

                console.log('Found meta ' + metaId)

                if (lastText !== telegrams[telegramIndex].previousText) {
                    const content = lastText + ' @ ' + telegrams[telegramIndex].name + ' - ' + followers + ' - ' + telegrams[telegramIndex].url

                    console.log('Content found: ' + content)
                }

                telegrams[telegramIndex].previousText = lastText
            })
            .catch((error) => {
                if (error.response) {
                    console.error('Error with server response')
                    console.error(JSON.stringify(error.response.data))
                    console.error(JSON.stringify(error.response.status))
                    console.error(JSON.stringify(error.response.headers))
                } else if (error.request) {
                    console.error('No response from server')
                    console.error(JSON.stringify(error.request))
                } else {
                    console.error('Something else')
                    console.error(JSON.stringify(error.message))
                }
            })
    }
}

run()

setInterval(run, 60e3 * 5)