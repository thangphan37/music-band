const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const port = 5000

require('dotenv').config()

//connect mongodb in local enviroment
// mongoose.connect('mongodb://localhost:27017/music-band', {

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Server is working :)')
})

app.use(require('./api/'))

app.listen(port, () => {
  console.log(`Music band api listening at http://localhost:${port}`)
})
