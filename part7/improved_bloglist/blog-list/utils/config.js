require('dotenv').config()

const PORT = process.env.PORT

const MONGO_DB_URI = process.env.NODE_ENV === 'production' ? process.env.MONGO_DB_URI : process.env.TEST_MONGO_DB_URI

module.exports = {
  MONGO_DB_URI,
  PORT
}