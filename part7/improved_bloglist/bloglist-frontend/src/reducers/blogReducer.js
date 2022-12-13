import blogService from '../services/blogs'
import { showNotificationWithTimeout } from './messageReducer'

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'CREATE':
    return [...state, action.blog]
  case 'UPDATE': {
    const updatedBlogs = state.map(blog => blog.id === action.blog.id ? action.blog : blog)
      .sort((a, b) => b.likes - a.likes)
    return updatedBlogs
  }
  case 'INIT':
    return action.blogs
  case 'DELETE':
    return state.filter(blog => blog.id !== action.blogId)
  default:
    return state
  }
}

export const updateBlog = (blog) => {
  return {
    type: 'UPDATE',
    blog: blog
  }
}

const createBlog = (blog) => {
  return {
    type: 'CREATE',
    blog: blog
  }
}

const deleteBlog = (blogId) => {
  return {
    type: 'DELETE',
    blogId: blogId
  }
}

export const updateBlogList = (updatedBlog) => {
  return async (dispatch, getState) => {
    await blogService.update(updatedBlog).then(blog => {
      const state = getState()
      
      console.log(state, 'dsasdasdasdsad')
      dispatch({
        type: 'UPDATE',
        blog: blog
      })
    }).catch(err => {
      dispatch(showNotificationWithTimeout(err.message, true, 5))
    })
  }
}


export const createNewBlog = (blogObj, callback) => {
  return async dispatch => {
    await blogService.create(blogObj).then(blog => {
      dispatch(createBlog(blog))
      dispatch(showNotificationWithTimeout('Blog successfully added', false, 5))
      callback()
    }).catch((err) => {
      dispatch(showNotificationWithTimeout(err.message, true, 5))
    })
  }
}

export const deleteBlogFromList = (blogId) => {
  return async dispatch  => {
    await blogService.deleteBlog(blogId).then(() => {
      dispatch(deleteBlog(blogId))
    }).catch(err => {
      dispatch(showNotificationWithTimeout(err.message, true, 5))
    })
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogsData = await blogService.getAll()

    dispatch({
      type: 'INIT',
      blogs: blogsData
    })
  }
}

export default reducer