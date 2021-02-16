const mongoose = require('mongoose')
const {Schema} = mongoose

const vocabularySchema = new Schema({
  jp: String,
  en: String,
  vi: String,
})

module.exports = {
  vocabularySchema,
}
