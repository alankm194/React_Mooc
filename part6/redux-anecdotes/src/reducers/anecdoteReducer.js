import anecdoteService from '../services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

export const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}


const reducer = (state = [], action) => {
  switch (action.type) {
    case 'VOTE':
      return state
        .map(anecdote => anecdote.id === action.data.id ? action.data.anecdote : anecdote)
        .sort((a, b) => b.votes - a.votes)
    case 'CREATE':
      return state.concat(action.data.content)
    case 'INIT':
      return action.data
    default:
      return state
  }
}

export const createAnecdote = (newAnecdote) => {
  return async dispatch => {
    const savedAnecdote = await anecdoteService.create(newAnecdote)
    dispatch({
      type: 'CREATE',
      data: {
        content: savedAnecdote
      }
    })
  }
}

export const voteForAnecdote = (anecdote) => {
  return async dispatch => {
    const modAnecdote = {content: anecdote.content, votes: ++anecdote.votes, id: anecdote.id}
    anecdoteService.update(modAnecdote)
    dispatch({
      type: 'VOTE',
      data: {
        anecdote: modAnecdote
      }
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT',
      data: anecdotes
    })
  }
}
export default reducer