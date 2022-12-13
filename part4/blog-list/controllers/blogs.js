const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const { InvalidTokenError } = require('../utils/ErrorFactory')
const User = require('../models/user')

blogRouter.get('/', async (request, response, next) => {
    const searchedBlogs = await Blog.find({}).populate('user')
    response.json(searchedBlogs)
})

blogRouter.post('/', async (request, response, next) => {
    const body = request.body
    if (!request.user) {
        return next(new InvalidTokenError('missing or invalid token'))
    }
    const user = request.user

    const newBlog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id
    })
    if (!newBlog.title || !newBlog.url) {
        return response.status(400).end()
    }
    const result = await newBlog.save()
    response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response, next) => {
    const id = request.params.id
    if (request.user === null) {
        return next(new InvalidTokenError('missing or invalid token'))
    }
    if (!id) {
        response.status(400).json({error: 'error no id supplied'})
    }
    const blogForDelete = await Blog.findById(id)

    if (!blogForDelete) {
        response.status(204).end()
        return
    } 

    const user = request.user
    if (request.user === null) {
        return next(new InvalidTokenError('missing or invalid token'))
    }
    
    if (blogForDelete !== null && blogForDelete.user.toString() === user.id) {
        await blogForDelete.delete()
        return response.status(204).end()
    } 
    response.status(401).end()
})

blogRouter.get('/:id', async (request, response, next) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog.toJSON())
    } else {
      response.status(404).end()
    }
})
  
blogRouter.put('/:id', async (request, response, next) => {
    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: body.user
    }
  
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog.toJSON())
})


module.exports = blogRouter