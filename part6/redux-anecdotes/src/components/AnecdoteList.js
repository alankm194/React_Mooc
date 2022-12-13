import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { voteForAnecdote } from "../reducers/anecdoteReducer";
import { showNotificationWithTimeout } from '../reducers/notificationReducer';


const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)
    console.log(anecdotes)

    const filterdAnecdotes = anecdotes.filter(anecdote => anecdote.content.includes(filter)) 
    const vote = (anecdote) => {
        dispatch(voteForAnecdote(anecdote))
        dispatch(showNotificationWithTimeout(`you voted '${anecdote.content}'`, 5))
    }

    return (
        <div>
        {filterdAnecdotes.map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote)}>vote</button>
            </div>
          </div>
        )}
        </div>
    )
}


export default AnecdoteList