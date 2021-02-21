const Singer = require('../models/singer')
const mongoose = require('mongoose')

async function updateHistory(singer, newHistory) {
  try {
    const history = singer.history.find((hi) => hi.name === newHistory)

    if (!history) {
      singer.history.push({
        name: newHistory,
        _id: mongoose.Types.ObjectId(),
      })
    }

    await singer.save()
  } catch (error) {
    throw new Error(error)
  }
}

function updateVocabulary(song, {jp, en, vi} = {}) {
  const vocaIndex = song.vocabulary.findIndex((vc) => vc.jp === jp)

  if (vocaIndex !== -1) song.vocabulary[vocaIndex] = {jp, en, vi}
  else song.vocabulary.push({jp, en, vi})
}

async function updateSong(
  singer,
  {_id, lyrics, vocabulary, hasRemembered, level} = {},
) {
  const song = await singer.songs.id(_id)

  if (lyrics) {
    song.lyrics = lyrics
  }

  if (vocabulary) {
    updateVocabulary(song, vocabulary)
  }

  if (hasRemembered !== undefined) {
    song.hasRemembered = hasRemembered
    song.rememberedDate = Date.now()
  }

  if (level) {
    song.level = level
  }

  await singer.save()
}

module.exports = {updateHistory, updateSong}
