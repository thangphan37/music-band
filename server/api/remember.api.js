const api = require('express').Router()
const Singer = require('../models/singer')

api.get('/remember', async (req, res) => {
  try {
    const singers = await Singer.find({'songs.hasRemembered': true})
    const filteredSong = []

    singers.forEach((singer) => {
      singer.songs.forEach(
        (s) =>
          s.hasRemembered &&
          filteredSong.push({...s.toObject(), singer: singer.name}),
      )
    })

    return res.json({
      success: true,
      code: 202,
      songs: filteredSong,
    })
  } catch ({message}) {
    return res.status(400).json({success: false, code: 400, message})
  }
})
module.exports = api
