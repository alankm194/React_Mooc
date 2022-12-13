
import blogService from '../services/blogs'
import loginService from '../services/login'
import { showNotificationWithTimeout } from './messageReducer'
const reducer = (state = null, action) => {
  switch (action.type) {
  case 'LOGIN':
    return action.user
  case 'LOGOUT':
    return null
  default:
    return state
  }
}

const logUserIn = (user) => {
  return {
    type: 'LOGIN',
    user: user
  }
}

export const logUserOut = () => {
  return dispatch => {
    window.localStorage.removeItem('currentBlogUser')
    blogService.setToken(null)
    dispatch({
      type: 'LOGOUT'
    })
  }
}

export const newUserLogin = (username, password) => {
  return async dispatch => {
    loginService.login({ username, password })
      .then((authUser) => {
        window.localStorage.setItem('currentBlogUser', JSON.stringify(authUser))
        blogService.setToken(authUser.token)
        dispatch(logUserIn(authUser))
        dispatch(showNotificationWithTimeout(`${username} has successfully logged in`, false, 5))

      }).catch(err => {
        console.log(err)
        dispatch(showNotificationWithTimeout(err.message, true, 5))
      })
  }
}

export const existingUserLogIn = () => {
  return dispatch => {
    const loggedUserJSON = window.localStorage.getItem('currentBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(logUserIn(user))
    }
  }

}


export default reducer