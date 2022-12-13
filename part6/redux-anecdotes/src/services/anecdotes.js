import axios from 'axios'
import { asObject } from '../reducers/anecdoteReducer'
const url = 'http://localhost:4000/anecdotes'

const getAll = async () => {
    const response = await axios.get(url)
    return response.data
}

const create = async (anecdote) => {
    const newAnecdote = asObject(anecdote)
    const response = await axios.post(url, newAnecdote)
    return response.data
}

const update = async (anecdote) => {
    const modifiedAnecdote = {
        content: anecdote.content,
        id: anecdote.id,
        votes: anecdote.votes
    }
    const response = await axios.put(`${url}/${anecdote.id}`, modifiedAnecdote)
    return response.data
} 
const anecdoteService = { getAll, create, update }
export default anecdoteService