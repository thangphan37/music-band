const api = require('express').Router()
const {crawlSong} = require('../utils/crawl.utils')

api.post('/crawl', async (req, res) => {
  try {
    const {singerName, playlist, avatar} = req.body
    const songs = await crawlSong('', {playlist, singerName, avatar})

    return res.json({success: true, code: 202, data: songs})
  } catch ({message}) {
    return res.status(400).json({success: false, code: 400, message})
  }
})

module.exports = api
