import { createStore, combineReducers } from 'redux'
import ReduxThunk from 'redux-thunk'
import { applyMiddleware } from 'redux'
import messageReducer from './reducers/messageReducer'
import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'

const reducer = combineReducers({
  'blogs': blogReducer,
  'message': messageReducer,
  'user': userReducer
})

const store = createStore(reducer, applyMiddleware(ReduxThunk))

export default store