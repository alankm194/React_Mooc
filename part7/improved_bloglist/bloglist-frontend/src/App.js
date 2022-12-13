import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import NewBlogForm from './components/BlogForm'
import Toggleable from './components/Toggleable'
import './App.css'
import { useSelector, useDispatch } from 'react-redux'
import { createNewBlog, initializeBlogs, updateBlogList, deleteBlogFromList } from './reducers/blogReducer'
import { newUserLogin, existingUserLogIn, logUserOut } from './reducers/userReducer'


const Notification = ({ message, isError }) => {
  let htmlClass = 'success'
  if (isError) {
    htmlClass = 'error'
  }
  return (
    <div id='notification' className={htmlClass}>
      {message}
    </div>
  )
}
const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const message = useSelector(state => state.message.content)
  const isError = useSelector(state => state.message.isError)
  const user = useSelector(state => state.user)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

  // const showMessage = (shownmessage, showAsError) => {
  //   dispatch(showNotificationWithTimeout(shownmessage, showAsError, 5))
  // }

  const handleLogin = event => {
    event.preventDefault()
    dispatch(newUserLogin(username, password))
    setUsername('')
    setPassword('')
  }

  const updateLikesBlog = async updatedBlog => {
    dispatch(updateBlogList(updatedBlog))
    // try {
    //   await blogService.update(updatedBlog)
    //   let blogUpdated = blogs.find(blog => blog.id === updatedBlog.id)
    //   blogUpdated.likes = updatedBlog.likes
    //   dispatch(updateBlog(blogUpdated))
    // } catch (err) {
    //   showMessage(err.response.data.error, true)
    // }
  }

  const handlePasswordChange = event => { setPassword(event.target.value) }
  const handleUsernameChange = event => { setUsername(event.target.value) }
  const handleLogout = () => { dispatch(logUserOut()) }

  const addNewBlog = async newBlogObj => {
    dispatch(createNewBlog(newBlogObj, blogFormRef.current.toggleVisibility))
    // try {
    //   const newBlog = await blogService.create(newBlogObj)
    //   dispatch(createBlog(newBlog))
    //   showMessage('Blog successfully added', false)
    //   blogFormRef.current.toggleVisibility()
    // } catch (err) {
    //   showMessage(err.response.data.error, true)
    // }
  }

  const removeBlog = async blogId => {
    dispatch(deleteBlogFromList(blogId))

    // try {
    //   await blogService.deleteBlog(blogId)
    //   dispatch(deleteBlog(blogId))
    // } catch (err) {
    //   showMessage(err.response.data.error, true)
    // }
  }

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    dispatch(existingUserLogIn())
  }, [])

  if (user === null) {
    return (
      <div>
        {message && <Notification message={message} isError={isError} />}
        <h1>Login to the application</h1>
        <Login
          handleLogin={handleLogin}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
          username={username}
          password={password} />
      </div>
    )
  }
  return (
    <div>
      {message && <Notification message={message} isError={isError} />}
      <h2>{user.username} has logged in <button onClick={handleLogout}>logout</button></h2>
      <h2>blogs</h2>
      <Toggleable buttonId='create-blog-btn' buttonLabel='create blog here' ref={blogFormRef}>
        <NewBlogForm addNewBlog={addNewBlog} />
      </Toggleable>
      <div data-cy='blogs-grp'>
        {blogs.map(blog =>
          <Blog key={blog.id}
            blog={blog}
            updateLikesBlog={updateLikesBlog}
            deleteBlog={removeBlog}
          />
        )}
      </div>
    </div>
  )
}

export default App