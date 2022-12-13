const logger = require('./logger')
require('./ErrorFactory')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { InvalidUsernameOrPassword } = require('./ErrorFactory')
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message, error.name, error)
  console.log(error)


  if (error.name === 'CastError') {
  } else if (error.name === 'ValidationError') {
    return response.status(400).send(error.message)
  } else if (error.name === 'MongoError' && error.message.includes('E11000 duplicate key error collection')) {
    return response.status(400).json({error: `the username ${error.keyValue.username} already exists`})
  } else if (error.name === 'JsonWebTokenError') {    
    return response.status(401).json(  {error: error.message} )
  } else if(error.name === 'InvalidUsernameOrPassword') {
    return response.status(401).json( {error: error.message} )
  } else if(error.name === 'InvalidTokenError') {
    return response.status(401).json( {error: error.message} )
  } else if(error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: error.message })
  } else if (error.name === 'InvalidUserPermissions') {
    return response.status(401).json({ error: error.message })
  } else {
    return response.status(500).send({error: 'unknown server error'})
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next();
}

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    request.user = null
  } else {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    request.user = user
  }

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}