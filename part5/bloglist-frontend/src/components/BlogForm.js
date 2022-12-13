import React, { useState } from 'react'


const NewBlogForm = ({ addNewBlog }) => {
  const [newAuthor, setNewAuthor] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleBlogSubmit = async event => {
    event.preventDefault()
    const blogObj = {
      author: newAuthor,
      title: newTitle,
      url: newUrl
    }
    await addNewBlog(blogObj)

  }

  return (
    <div>
      <form name={'createBlogForm'} onSubmit={handleBlogSubmit}>
        <label htmlFor='title-input'>title&nbsp;</label>
        <input id='title-input'type='text' onChange={event => setNewTitle(event.target.value)} name='title' value={newTitle}></input>
        <label htmlFor='author-input'>author&nbsp;</label>
        <input id='author-input'type='text' name='author' value={newAuthor} onChange={event => setNewAuthor(event.target.value)}></input>
        <label htmlFor='url-input'>url&nbsp;</label>
        <input id='url-input'type='text' name='url' value={newUrl} onChange={event => setNewUrl(event.target.value)}></input>
        <button id='submit-blog-btn' type='submit'>save</button>
      </form>
    </div>
  )
}

export default NewBlogForm