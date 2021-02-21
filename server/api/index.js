const api = require('express').Router()

api.use(require('./singer.api.js'))
api.use(require('./song.api.js'))
api.use(require('./crawl.api.js'))
api.use(require('./remember.api.js'))

module.exports = api
