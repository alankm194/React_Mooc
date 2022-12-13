import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Login from './components/Login'
import loginService from './services/login'
import NewBlogForm from './components/BlogForm'
import Toggleable from './components/Toggleable'
import './App.css'

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
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)


  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const blogFormRef = useRef()

  const showMessage = (shownmessage, showAsError) => {
    setIsError(showAsError)
    setMessage(shownmessage)
    setTimeout(() => { setMessage(null) }, 5000)
  }

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const authUser = await loginService.login({ username, password })
      window.localStorage.setItem('currentBlogUser', JSON.stringify(authUser))
      blogService.setToken(authUser.token)
      setUser(authUser)
      setUsername('')
      setPassword('')
      showMessage(`${authUser.username} has been successfully logged in`, false)
    } catch (err) {
      showMessage(err.response.data.error, true)
    }
  }

  const updateLikesBlog = async updatedBlog => {
    try {
      await blogService.update(updatedBlog)
      const remainingBlogs = blogs.filter(blog => blog.id !== updatedBlog.id)
      let blogUpdated = { ...blogs.find(blog => blog.id === updatedBlog.id) }
      blogUpdated.likes = updatedBlog.likes
      const allBlogs = [...remainingBlogs, blogUpdated].sort((a, b) => b.likes - a.likes)
      setBlogs(allBlogs)
    } catch (err) {
      showMessage(err.response.data.error, true)
    }
  }

  const handlePasswordChange = event => { setPassword(event.target.value) }
  const handleUsernameChange = event => { setUsername(event.target.value) }
  const handleLogout = () => {
    window.localStorage.removeItem('currentBlogUser')
    blogService.setToken(null)
    setUser(null)
  }

  const addNewBlog = async newBlogObj => {
    try {
      const newBlog = await blogService.create(newBlogObj)
      setBlogs([...blogs, newBlog])
      showMessage('Blog successfully added', false)
      blogFormRef.current.toggleVisibility()
    } catch (err) {
      showMessage(err.response.data.error, true)
    }
  }

  const deleteBlog = async blogId => {
    try {
      await blogService.deleteBlog(blogId)
      const remainingBlogs = blogs.filter(blog => blog.id !== blogId)
      setBlogs(remainingBlogs)
    } catch (err) {
      console.log(err.response)
      showMessage(err.response.data.error, true)
    }
  }

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('currentBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
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
            deleteBlog={deleteBlog}
          />
        )}
      </div>
    </div>
  )
}

export default App