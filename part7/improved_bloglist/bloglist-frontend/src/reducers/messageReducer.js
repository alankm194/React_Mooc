

const reducer = (state = {}, action) => {
  switch (action.type) {
  case 'NEW_MESSAGE':
    return action.data
  case 'REMOVE_MESSAGE':
    return ''
  default:
    return state
  }
}

const timer = {
  timeoutId: undefined,
  setUp: function (func, timeout) {
    this.timeoutId = setTimeout(() => { func() }, timeout * 1000)
  },
  cancel: function () {
    clearTimeout(this.timeoutId)
  }
}

export const showNotificationWithTimeout = (content, isError, timeout) => {
  return dispatch => {
    dispatch(createMessage(content, isError))
    if (typeof timer.timeoutId === 'number') {
      timer.cancel()
    }
    timer.setUp(() => { dispatch(removeMessage()) }, timeout)

  }
}


const createMessage = (message, isError) => {
  return {
    type: 'NEW_MESSAGE',
    data: {
      content: message,
      isError: isError
    }
  }
}

const removeMessage = () => {
  return {
    type: 'REMOVE_MESSAGE',
  }
}


export default reducer