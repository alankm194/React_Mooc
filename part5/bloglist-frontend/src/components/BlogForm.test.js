import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

describe('', () => {
  test('', () => {
    const mockCreateBlog = jest.fn()
    render(
      <BlogForm addNewBlog={mockCreateBlog}/>
    )

    const titleInput = screen.getByLabelText('title')
    const authorInput = screen.getByLabelText('author')
    const urlInput = screen.getByLabelText('url')
    const form = screen.getByRole('form')

    const titleExpected = 'testing of forms could be easier'
    const authorExpected = 'tester'
    const urlExpected = 'www.ddddd.com'
    fireEvent.change(titleInput, {
      target: { value: titleExpected }
    })
    fireEvent.change(authorInput, {
      target: { value: authorExpected }
    })
    fireEvent.change(urlInput, {
      target: { value: urlExpected }
    })
    fireEvent.submit(form)

    expect(mockCreateBlog.mock.calls).toHaveLength(1)
    expect(mockCreateBlog.mock.calls[0][0].title).toBe(titleExpected)
    expect(mockCreateBlog.mock.calls[0][0].author).toBe(authorExpected)
    expect(mockCreateBlog.mock.calls[0][0].url).toBe(urlExpected)
  })
})