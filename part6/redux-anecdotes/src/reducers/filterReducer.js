



const reducer = (state = '', action) => {
    switch (action.type) {
        case 'FILTER':
            return action.data
        default:
            return state;
    }
}

export const filterAnecdote = (filter) => {
    return {
        type: 'FILTER',
        data: filter
    }
}

export default reducer