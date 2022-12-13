import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'

const blogObj = {
  author: 'john',
  title: 'titleofblog',
  url: 'blog.title.com',
  user: {
    username: 'user',
    id: 'sadassdasd'
  },
  likes: 300
}

describe('When blog is initially displayed', () => {
  let component
  beforeAll(() => {
    component = render(
      <Blog blog={blogObj} />
    )
  })

  test('then only author and title is displayed', () => {
    const element = component.getByText(`${blogObj.title} ${blogObj.author}`)
    expect(element).toBeDefined()
  })

  test('And Url is not displayed', () => {
    expect(component.container).not.toHaveTextContent(`url ${blogObj.url}`)
  })

  test('And likes is not displayed', () => {
    expect(component.container).not.toHaveTextContent(`likes ${blogObj.likes}`)
  })

  test('And username is not displayed', () => {
    expect(component.container).not.toHaveTextContent(`${blogObj.user.username}`)
  })
})

describe('When view more is clicked', () => {
  let component = null
  beforeEach(() => {
    component = render(
      <Blog blog={blogObj} />
    )
    const button = component.getByText('view more')
    fireEvent.click(button)

  })

  test('then the author and title is displayed', () => {
    const element = component.getByText(`${blogObj.title} ${blogObj.author}`)
    expect(element).toBeDefined()
  })

  test('then the url is displayed', () => {
    expect(component.container).toHaveTextContent(`${blogObj.url}`)
  })

  test('then the likes with correct number is displayed', () => {
    expect(component.container).toHaveTextContent(`likes ${blogObj.likes}`)
  })
})

describe('Given like button', () => {

  test('when clicked twice then handler function should have been called wice ', () => {
    const mockHandler = jest.fn()

    const component = render(
      <Blog blog={blogObj} updateLikesBlog={mockHandler}/>
    )
    const button = component.getByText('view more')
    fireEvent.click(button)


    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)

  })
})