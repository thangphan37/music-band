const Singer = require('../models/singer')

async function updateHistory(singer, history, name) {
  try {
    const oldHistory = singer.history

    if (!oldHistory.includes(history)) {
      await Singer.updateOne({name}, {history: [...oldHistory, history]})
    }
  } catch (error) {
    throw new Error(error)
  }
}

function updateVocabulary(song, {jp, en, vi} = {}) {
  const vocaIndex = song.vocabulary.findIndex((vc) => vc.jp === jp)

  if (vocaIndex !== -1) song.vocabulary[vocaIndex] = {jp, en, vi}
  else song.vocabulary.push({jp, en, vi})
}

async function updateSong(singer, {_id, lyrics, vocabulary} = {}) {
  const song = await singer.songs.id(_id)

  if (lyrics) {
    song.lyrics = lyrics
  }

  if (vocabulary) {
    updateVocabulary(song, vocabulary)
  }

  singer.save()
}

module.exports = {updateHistory, updateSong}
