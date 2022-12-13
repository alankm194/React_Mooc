const { count } = require('../models/blog')
const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}


const totalLikes = (blogs) => {
  const likeCount = blogs.reduce((acc, current) => acc + current.likes, 0)
  return likeCount
}


const favouriteBlog = (blogs) => {

  const faveBlog = blogs.reduce((favourite, current) => favourite.likes > current.likes ? favourite : current, {} )
  return faveBlog;
} 

const findMaxValueInMap = (mapValues) => {
  let iterator = mapValues.entries()
  let maxValue = iterator.next().value
  for (const val of iterator) {
    if (val[1] > maxValue[1] ) {
      maxValue = val
    }
  }
  return maxValue
}

const mostBlogs = (blogs) => {
  const authorMap = new Map()
  if (blogs.length === 0) {
    return {}
  }
  blogs.forEach(blog => {
    if (authorMap.has(blog.author)) {
      authorMap.set(blog.author, authorMap.get(blog.author) + 1)
    } else {
      authorMap.set(blog.author, 1)
    }
  })

  const maxValue = findMaxValueInMap(authorMap)
  return {author: maxValue[0], blogs: maxValue[1]}
}

const mostLikes = (blogs) => {
  const authorMap = new Map()
  if (blogs.length === 0) {
    return {}
  }
  blogs.forEach(blog => {
    if (authorMap.has(blog.author)) {
      authorMap.set(blog.author, authorMap.get(blog.author) + blog.likes)
    } else {
      authorMap.set(blog.author, blog.likes)
    }
  })

  const maxValue = findMaxValueInMap(authorMap)
  return {author: maxValue[0], likes: maxValue[1]}
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}
