import React from 'react'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { connect } from 'react-redux'
import { showNotificationWithTimeout } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {

    const addAnecdote = (event) => {
        event.preventDefault()
        const newAnecdote = event.target.anecdote.value
        event.target.anecdote.value = ''
        props.createAnecdote(newAnecdote)
        props.showNotificationWithTimeout(`news anecdote '${newAnecdote}'`, 5)
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div><input name="anecdote" /></div>
                <button>create</button>
            </form>
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        createAnecdote: value => {
            dispatch(createAnecdote(value))
        },
        showNotificationWithTimeout: (value, time) => {
            dispatch(showNotificationWithTimeout(value, time))
        }
    }
}

const AnecdoteFormConnector = connect(
    null,
    mapDispatchToProps
)(AnecdoteForm)


export default AnecdoteFormConnector