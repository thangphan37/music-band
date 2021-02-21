const api = require('express').Router()
const Singer = require('../models/singer')
const {crawlSong} = require('../utils/crawl.utils')

api.post('/crawl', async (req, res) => {
  try {
    const {singerName, playlist, avatar} = req.body
    const singer = await Singer.findOne({name: singerName})

    if (singer) throw new Error('This singer has crawled!')

    const songs = await crawlSong('', {playlist, singerName, avatar})

    return res.json({success: true, code: 202, data: songs})
  } catch ({message}) {
    return res.status(400).json({success: false, code: 400, message})
  }
})

module.exports = api
