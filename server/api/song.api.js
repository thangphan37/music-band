const api = require('express').Router()
const Singer = require('../models/singer')

api.get('/songs', async (req, res) => {
  try {
    const {
      query: {name, song},
    } = req
    const singer = await Singer.findOne({name})
    const regex = new RegExp(song, 'i')
    const songs = singer.songs.filter((f) => f.song.match(regex))

    return res.json({success: true, code: 202, songs})
  } catch ({message}) {
    return res.status(400).json({success: false, code: 400, message})
  }
})

api.get('/songs/:name/:songId', async (req, res) => {
  try {
    const {name, songId} = req.params
    const singer = await Singer.findOne({name})

    if (singer) {
      const song = await singer.songs.id(songId)
      return res.json({success: true, code: 202, song})
    }

    return res.json({success: true, code: 202, message: 'Singer not found'})
  } catch ({message}) {
    return res.status(400).json({success: false, code: 400, message})
  }
})

module.exports = api
