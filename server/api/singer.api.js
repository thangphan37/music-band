const api = require('express').Router()
const mongoose = require('mongoose')
const Singer = require('../models/singer')
const {updateHistory, updateSong} = require('../utils/singer.utils')

api.get('/singers', async (req, res) => {
  try {
    const singers = await Singer.find({})

    return res.json({success: true, code: 202, singers})
  } catch ({message}) {
    return res.status(400).json({success: false, code: 400, message})
  }
})

api.get('/singer', async (req, res) => {
  try {
    const {
      query: {name, page},
    } = req
    const singer = await Singer.findOne({name})
    const songs = singer.songs.splice(page * 5, 5)

    return res.json({
      success: true,
      code: 202,
      songs,
      history: singer.history,
      hasMore: page * 5 < singer.songs.length,
    })
  } catch ({message}) {
    return res.status(400).json({success: false, code: 400, message})
  }
})

api.post('/singer', async (req, res) => {
  try {
    const {singerName, avatar, songName, songHref} = req.body
    const song = {
      _id: mongoose.Types.ObjectId(),
      song: songName,
      href: songHref,
      lyrics: '',
      vocabulary: [],
    }

    let singer = await Singer.findOne({name: singerName})

    if (singer) {
      const sIndex = singer.songs.findIndex((s) => s.href === songHref)

      if (sIndex !== -1) singer.songs[sIndex].song = songName
      else singer.songs.push(song)
    } else {
      singer = new Singer({
        _id: mongoose.Types.ObjectId(),
        name: singerName,
        avatar,
        history: [],
        songs: [song],
      })
    }

    singer.save()

    return res.json({success: true, code: 200})
  } catch ({message}) {
    return res.status(400).json({success: false, code: 400, message})
  }
})

api.put('/singer', async (req, res) => {
  try {
    const {history, song} = req.body
    const {
      query: {name},
    } = req

    const singer = await Singer.findOne({name})

    if (history) {
      await updateHistory(singer, history)
    }

    if (song) {
      await updateSong(singer, song)
    }

    return res.json({success: true, code: 200})
  } catch ({message}) {
    return res.status(400).json({success: false, code: 400, message})
  }
})

api.delete('/singer', async (req, res) => {
  try {
    const {_id, name: historyName} = req.body
    const {
      query: {name},
    } = req

    const singer = await Singer.findOne({name})
    await singer.history.id(_id).remove()

    singer.save()

    return res.json({
      success: true,
      code: 200,
      message: 'Deleted history from singer!',
    })
  } catch ({message}) {
    return res.status(400).json({success: false, code: 400, message})
  }
})

module.exports = api
