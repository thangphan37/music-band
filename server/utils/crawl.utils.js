const puppeteer = require('puppeteer')
const mongoose = require('mongoose')
const Singer = require('../models/singer')

/*GreeeN
  https://www.youtube.com/c/GReeeeNOfficial/videos
  GReeeeN

  https://www.youtube.com/user/aimyong/videos
  あいみょん 

  https://www.youtube.com/channel/UC7rqz5As19qYWl2Rc4z-iig/videos
  Lefty Hand Cream
*/
const SINGER = {
  link: 'https://www.youtube.com/c/GReeeeNOfficial/videos',
  name: 'GReeeeN',
}

const LYRICS = {
  link: 'https://j-lyric.net/artist/a04cb21/',
}

async function crawlSong(song = '', {playlist, singerName, avatar} = {}) {
  try {
    const browser = await puppeteer.launch({headless: true})
    const page = await browser.newPage()
    await page.goto(playlist)

    let previousHeight
    let count = 0

    while (true) {
      previousHeight = await page.evaluate(
        'document.querySelector("ytd-app").offsetHeight',
      )

      await page.evaluate(`window.scrollTo(0, ${previousHeight})`)
      await page.waitForTimeout(1000)

      const currentHeight = await page.evaluate(
        'document.querySelector("ytd-app").offsetHeight',
      )

      if (currentHeight == previousHeight) {
        count++
      }

      if (count >= 2) {
        break
      }
    }

    const options = (
      await page.$$eval(
        '#dismissable.style-scope.ytd-grid-video-renderer',
        (options) =>
          options.map((option) => {
            const title = option.querySelector('#video-title')
            return {
              song: title.textContent,
              href: title.href,
              lyrics: '',
              vocabulary: [],
            }
          }),
      )
    ).filter((t) => t.song.includes(song))

    const data = new Singer({
      name: singerName,
      avatar,
      songs: options.map((op) => ({...op, _id: mongoose.Types.ObjectId()})),
    })

    data.save()

    await browser.close()

    return options
  } catch (error) {
    console.log('CrawlSinger.getError:', error)
  }
  // const videos = await page.evaluate()
  // console.log('outside while loop', videos)
}

module.exports = {
  crawlSong,
}
