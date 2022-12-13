const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { ValidationError } = require('../utils/ErrorFactory')

userRouter.post('/', async (request, response, next) => {
    const body = request.body
    if (!body.password || (body.password.length  < 3)) {
        const error = new ValidationError("password requires length of at least 3")
        return next(error)
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    const result = await user.save()
    response.status(201).json(result)

})

userRouter.get('/', async (request, response, next) => {

    const users = await User.find({}).populate('blogs')
    response.json(users)
})

module.exports = userRouter