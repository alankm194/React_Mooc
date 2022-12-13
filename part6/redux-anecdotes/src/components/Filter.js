import React from 'react'
import { connect } from 'react-redux';
import { filterAnecdote } from '../reducers/filterReducer'


const Filter = (props) => {

    const handleChange = (event) => {
        props.filterAnecdote(event.target.value)
    }
    const style = {
        marginBottom: 10
    }

    return (
        <div style={style}>
            filter <input value={props.filter} onChange={handleChange} />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        filter: state.filter
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        filterAnecdote: value => {
            dispatch(filterAnecdote(value))
        }
    }
}

const filterConnect = connect(
    mapStateToProps,
    mapDispatchToProps
)(Filter)

export default filterConnect