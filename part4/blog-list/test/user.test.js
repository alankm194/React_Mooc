
const app = require('../app')
const supertest = require('supertest')
const mongoose = require('mongoose')
const User = require('../models/user')

const api = supertest(app)
const url = '/api/users'
const bcrypt = require('bcrypt')


describe('when adding a user', () => {

    beforeEach(async () => {
        await User.deleteMany({})
    
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
    
        await user.save()
      })

    test('given a username that already exists then return 400 and do not add user to DB', async () => {
        const existingUserHash = await bcrypt.hash('existinguserpassword123', 1)

        const existingUser = {
            username: 'copycat',
            name: 'saddsallasd',
            passwordHash: existingUserHash
        }

        const existingUserSaved = await new User(existingUser).save()
        expect(existingUserSaved).toMatchObject({username: existingUser.username})

        const newUser = {
            username: 'copycat',
            name: 'adsnsda', 
            password: 'ssdfhfdsijosdf'
        }

        const response = await api.post(url).send(newUser).expect(400)
        expect(response.error.text).toContain(`the username ${existingUser.username} already exists`)

        const findUser = await User.find({username: existingUser.username})
        expect(findUser).toHaveLength(1)
    })

    test('Given a username that is less than 3 characters long return 400 error and do not add user to DB', async () => {
        const newUser = {
            username: 'cc',
            name: 'saddsallasd',
            password: 'pass123333' 
        }
        const response = await api.post(url).send(newUser).expect(400)
    
        expect(response.error.text).toEqual(`User validation failed: username: Path \`username\` (\`${newUser.username}\`) is shorter than the minimum allowed length (3).`)

        const findUser = await User.find({username: newUser.username})
        expect(findUser).toHaveLength(0)
    })

    test ('Given a password that is less than 3 characters long return 400 error and do not add user to DB', async () => {
        const newUser = {
            username: 'ccsdad',
            name: 'saddsallasd',
            password: 'pa' 
        }
        const response = await api.post(url).send(newUser).expect(400)
        expect(response.error.text).toEqual('password requires length of at least 3')

        const findUser = await User.find({username: newUser.username})
        expect(findUser).toHaveLength(0)
    })


    test('given a valid user data then creation of new user succeeds', async () => {
        const newUser = {
            username: 'lemonlemonlemon',
            name: 'ddddaaadddd',
            password: 'mypass'
        }
        await api.post(url).send(newUser)

        const foundUser = await (await User.find({username: newUser.username}))
        expect(foundUser[0]).toMatchObject({username: newUser.username, name: newUser.name})
    })

    
})

afterAll(async () => {
    await mongoose.connection.close(true);
})
