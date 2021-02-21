const mongoose = require('mongoose')
const {Schema} = mongoose

const historySchema = new Schema({
  name: String,
})

module.exports = {
  historySchema,
}
