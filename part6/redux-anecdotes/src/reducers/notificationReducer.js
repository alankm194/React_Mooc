
const reducer = (state = null, action) => {
    switch (action.type) {
        case 'UPDATE':
            return action.data
        case 'REMOVE':
            return null
        default:
            return state
    }
}


const showNotification = (content) => {
    return {
        type: 'UPDATE',
        data: content
    }
}

const hideNotification = () => {
    return {
        type: 'REMOVE'
    }
}
const timer = {
    timeoutId: undefined,
    setUp: function(func, timeout) {
        this.timeoutId = setTimeout(() => { func() }, timeout * 1000)
        console.log(this)
    },
    cancel: function() {
        clearTimeout(this.timeoutId)
    }
}

export const showNotificationWithTimeout = (content, timeout) => {
    return dispatch => {
        dispatch(showNotification(content))
        if (typeof timer.timeoutId === 'number') {
            timer.cancel()
        }
        timer.setUp(() => { dispatch(hideNotification()) }, timeout)

    }
}


export default reducer