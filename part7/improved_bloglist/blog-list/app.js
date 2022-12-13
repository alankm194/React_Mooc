const config = require('./utils/config')
const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogs')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const testingRouter = require('./controllers/testing')

logger.info('connecting to database')
mongoose.connect(config.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/blogs', middleware.userExtractor, blogRouter)
app.use('/api/users', userRouter)

if (process.env.NODE_ENV === 'test') {
    app.use('/api/testing', testingRouter)
}


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app