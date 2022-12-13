let initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  let newState = {good: state.good, ok: state.ok, bad: state.bad}

  switch (action.type) {
    case 'GOOD':
      newState.good = state.good + 1
            console.log(newState)
      return newState
    case 'OK':
      newState.ok = newState.ok + 1
      return newState
    case 'BAD':
      newState.bad = newState.bad + 1 
      return newState
    case 'ZERO':
      return initialState 
    default: return state
  }
  
}

export default counterReducer