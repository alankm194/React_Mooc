import React, { useState } from 'react'

const Blog = ({ blog, updateLikesBlog, deleteBlog }) => {
  const [viewMore, setViewMore] = useState(false)
  const buttonText = viewMore ? 'hide' : 'view more'

  const handleDelete = async event => {
    event.preventDefault()
    await deleteBlog(blog.id)
  }
  const handleLikesClick = async event => {
    event.preventDefault()
    const newBlog = {
      author: blog.author,
      url: blog.url,
      title: blog.title,
      user: blog.user.id,
      likes: blog.likes + 1,
      id: blog.id
    }
    await updateLikesBlog(newBlog)
  }

  return (
    <div className='blog-box' data-cy='blog-data-indiv'>
      {blog.title} {blog.author}
      {viewMore &&
        <div data-cy='blog-metadata-div'>
          <ul>
            <li>{blog.url}</li>
            <li>likes {blog.likes} <button data-cy="like-more-btn" onClick={handleLikesClick}>like</button></li>
            <li>{blog.user.username}</li>
          </ul>
          <button data-cy="delete-blog-btn"onClick={handleDelete}>delete</button>
        </div>
      }

      <button data-cy="view-more-btn" onClick={() => { setViewMore(!viewMore) }}>{buttonText}</button>
    </div>
  )
}

export default Blog