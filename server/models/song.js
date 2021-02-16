const mongoose = require('mongoose')
const {Schema} = mongoose
const {vocabularySchema} = require('./vocabulary')

const songSchema = new Schema({
  href: String,
  lyrics: String,
  song: String,
  vocabulary: [vocabularySchema],
})

module.exports = {
  songSchema,
}
