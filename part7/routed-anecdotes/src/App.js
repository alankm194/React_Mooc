import React, { useState } from 'react'
import { Switch, Route, Link, useRouteMatch, useHistory } from 'react-router-dom'
import { useField } from './hooks/index'

const Menu = (props) => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <div>
        <Link to="/" style={padding}>anecdotes</Link>
        <Link to="/create" style={padding}>create new</Link>
        <Link to="/about" style={padding}>about</Link>

      </div>
      <RouteMap anecdotes={props.anecdotes} addNew={props.addNew} notification={props.notification} />
    </div>
  )
}

const RouteMap = ({ anecdotes, addNew, notification }) => {
  const match = useRouteMatch('/anecdote/:id')

  const anecdote = match ? anecdotes.find(anec => anec.id === match.params.id) : null
  return (
    <Switch>
      <Route path="/about">
        <About />
      </Route>
      <Route path="/create">
        <CreateNew addNew={addNew} />
      </Route>
      <Route path="/anecdote/:id">
        <Anecdote anecdote={anecdote} />
      </Route>
      <Route path="/">
        <AnecdoteList anecdotes={anecdotes} notification={notification} />
      </Route>
    </Switch>
  )
}

const Anecdote = ({ anecdote }) => {
  return (
    <div>
      <h2>{anecdote.content}</h2>
      <p>has {anecdote.votes} votes</p>
      <p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
    </div>
  )
}

const AnecdoteList = ({ anecdotes, notification }) => (
  <div>
    {notification && <Notification message={notification} />}

    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => <li key={anecdote.id} ><Link to={`/anecdote/${anecdote.id}`}>{anecdote.content}</Link></li>)}
    </ul>
  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://courses.helsinki.fi/fi/tkt21009'>Full Stack -websovelluskehitys</a>.

    See <a href='https://github.com/fullstack-hy/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2019/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const Notification = ({ message }) => {
  return ( 
    <>
      <p>{message}</p>
    </>
  )
}

const CreateNew = (props) => {
  const contentField = useField('text')
  const authorField = useField('text')
  const infoField = useField('text')
  const history = useHistory()

  const removeResetField = (obj) => {
    let {reset, ...newObj} = obj
    return newObj
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: contentField.value,
      author: authorField.value,
      info: infoField.value,
      votes: 0
    })
    history.push('/')
  }

  const handleReset = (e) => {
    e.preventDefault()
    contentField.reset()
    authorField.reset()
    infoField.reset()
  }

  let content = removeResetField(contentField)
  let author = removeResetField(authorField)
  let info = removeResetField(infoField)
  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button type='submit'>create</button>
        <button type='button' onClick={handleReset}>reset</button>
      </form>
    </div>
  )

}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: '1'
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: '2'
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0)
    setAnecdotes(anecdotes.concat(anecdote))
    setNotification(`a new anecdote ${anecdote.content} created!`)
    setTimeout(() => setNotification(''), 10 * 1000)
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu notification={ notification } anecdotes={ anecdotes } addNew={ addNew } />
      <Footer />
    </div>
  )
}

export default App;