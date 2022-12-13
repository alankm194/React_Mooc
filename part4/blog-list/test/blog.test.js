const app = require('../app')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)
const bcrypt = require('bcrypt')

const testUser = {
    username: 'tester',
    name: 'haaam'
} 

const initialblogs = [
    { title: 'HTML is easy', author: "ndsans", url: "google.com", likes: 123 },
    { title: 'Browser can execute only Javascript', author: "dsasdsda", url: "bbc.com", likes: 333 },
]

let loginToken = ''
const url = '/api/blogs'
beforeAll(async () => {
    await User.deleteMany({})
    let userObj = new User(testUser)
    const saltRounds = 10
    const passwordHash = await bcrypt.hash('sekret', saltRounds)
    userObj.passwordHash = passwordHash
    const savedUser = await userObj.save()
    initialblogs.forEach(e => e.user = savedUser.id)
    response = await api.post('/api/login').send({username: 'tester', password: 'sekret'})
    loginToken = JSON.parse(response.text).token
})
beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObj = new Blog(initialblogs[0])
    await blogObj.save()
    blogObj = new Blog(initialblogs[1])
    await blogObj.save()
})

describe("Given the database has existing blogs", () => {

    test('When a get request is called then response is returned as json', async () => {
        await api.get(url)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test('When a get request is called then all blogs will be returned', async () => {
        const resp = await api.get(url)
        expect(resp.body).toHaveLength(initialblogs.length)
    })
    
    test('When a get request is called then all blogs returned should have an id', async () => {
        const resp = await api.get(url)
        resp.body.forEach(content => expect(content.id).toBeDefined())
    })
})



describe('Given a new blog that is sent via a post request', () => {

    test('then a valid blog request is saved to the database', async () => {
        const newBlog = {
            title: 'new blog inserted',
            author: 'jltow',
            url: 'www.ksfnsfdn.sdfjk',
            likes: 33322233
        }
    
        const postResponse = await api
            .post(url)
            .set( {Authorization:`bearer ${loginToken}`} )
            .send(newBlog)
    
        expect(postResponse.body).toMatchObject(newBlog)
    
        const getResponse = await api.get(url)
        expect(getResponse.body).toHaveLength(initialblogs.length + 1)
    })
    
    test('when post request blog has no likes property then the likes property should default to zero', async () => {
        const newBlog = {
            title: 'new blog inserted',
            author: 'jltow',
            url: 'www.ksfnsfdn.sdfjk',
        }
    
        const postResp = await api
            .post(url)
            .set( {Authorization:`bearer ${loginToken}`} )
            .send(newBlog)

        expect(postResp.body.likes).toEqual(0)
        
    })
})

describe('when deleting a blog', () => {
    
    test('then a blog with a existing id should be deleted from the database', async () => {
        const newBlog = {
            title: 'new blog inserted',
            author: 'jltow',
            url: 'www.ksfnsfdn.sdfjk',
        }

        const postResp = await api
            .post(url)
            .set( {Authorization:`bearer ${loginToken}`} )
            .send(newBlog)

        const getResp = await api.get(url)
        expect(getResp.body).toHaveLength(initialblogs.length + 1)        
        
        const blog = postResp.body
        await api
            .delete(`${url}/${blog.id}`)
            .set( {Authorization:`bearer ${loginToken}`} )
            .expect(204)
        
        const afterDeleteResp = await api.get(url)
        expect(afterDeleteResp.body).toHaveLength(initialblogs.length)        
    })

    test('then a blog without existing id should return 400', async () => {
        await api
            .delete(`${url}/iuadgiuahuoisafbuisfbuiioua`)
            .set( {Authorization:`bearer ${loginToken}`} )
            .expect(400)
    })

    test('then a blog with no id should return 400', async () => {
        await api
            .delete(`${url}/`)
            .set( {Authorization:`bearer ${loginToken}`} )
            .expect(404)
    })
})


describe('Given a request that is missing a required field', () => {
    test('When title and url are missing return 400', async () => {
        const newBlog = {
            author: 'gdog'
        }
    
        await api
            .post(url)
            .set( {Authorization:`bearer ${loginToken}`} )
            .send(newBlog)
            .expect(400)
    })
    
    test('when post request blog object has no url then return 400 bad request', async () => {
        const newBlog = {
            author: 'gdog',
            title: 'hufsds'
        }
    
        await api
            .post(url)
            .send(newBlog)
            .set( {Authorization:`bearer ${loginToken}`} )
            .expect(400)
    })

    test('when post request blog object has no title then return 400 bad request', async () => {
        const newBlog = {
            author: 'gdog',
            url: 'dsasad'
        }
    
        await api
            .post(url)
            .send(newBlog)
            .set( {Authorization:`bearer ${loginToken}`} )
            .expect(400)
    })
})


describe('when updating a blog',  () => {
    test('then given a valid object and valid id then it should update the blog', async () => {
        let expectedBlog = initialblogs[0]
        expectedBlog.likes = 932193

        const resp = await api.get(url)

        const existingBlog = resp.body.filter(content => content.title === expectedBlog.title)[0]

        const putResp = await api.put(`${url}/${existingBlog.id}`).send(expectedBlog)

        const updatedBlog = putResp.body
        expect(updatedBlog).toMatchObject(expectedBlog)
    })
})

describe('Given user does not have a login token', () => {
    test('then user sending Post request gets 401 response',async () => {
        const newBlog = {
            author: 'gdog',
            title: 'dsd',
            url: '33333'
        }
    
        await api
            .post(url)
            .set( {Authorization:'bearer '} )
            .send(newBlog)
            .expect(401)
    })

    test('then user sending a Delete request gets 401 response',async () => {
        const newBlog = {
            title: 'new blog inserted',
            author: 'jltow',
            url: 'www.ksfnsfdn.sdfjk',
        }

        const postResp = await api
            .post(url)
            .set( {Authorization:`bearer ${loginToken}`} )
            .send(newBlog)

        const getResp = await api.get(url)
        expect(getResp.body).toHaveLength(initialblogs.length + 1)        
        const blog = postResp.body
    
        await api
            .delete(`${url}/${blog.id}`)
            .set( {Authorization:'bearer '} )
            .expect(401)

        const afterDeleteResponse = await api.get(url)
        expect(afterDeleteResponse.body).toHaveLength(initialblogs.length + 1)        

    })
})

afterAll(async () => {
    await mongoose.connection.close(true)
    await mongoose.disconnect();
})