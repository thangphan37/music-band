const mongoose = require('mongoose')
const {Schema} = mongoose
const {vocabularySchema} = require('./vocabulary')

const songSchema = new Schema({
  href: String,
  lyrics: String,
  song: String,
  level: {type: String, default: 'unset'},
  hasRemembered: {type: Boolean, default: false},
  rememberedDate: {type: Date},
  vocabulary: [vocabularySchema],
})

module.exports = {
  songSchema,
}
