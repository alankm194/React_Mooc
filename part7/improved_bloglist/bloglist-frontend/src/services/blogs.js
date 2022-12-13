import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = () => {
  const response = axios.get(baseUrl)
  return response.then(resp => resp.data)
}

const create = async newObj => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObj, config)
  return response.data
}
const update = async updatedObj => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.put(`${baseUrl}/${updatedObj.id}`, updatedObj, config)
  return response.data
}

const deleteBlog = async blogId => {
  const config = {
    headers: { Authorization: token }
  }
  await axios.delete(`${baseUrl}/${blogId}`, config)
}

const setToken = newToken => {
  token = `bearer ${newToken}`
}
const blogService = {
  getAll,
  create,
  setToken,
  update,
  deleteBlog
}
export default blogService