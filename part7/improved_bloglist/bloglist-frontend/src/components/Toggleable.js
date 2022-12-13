import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Toggleable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  Toggleable.propTypes = {
    buttonLabel: PropTypes.string.isRequired
  }

  const toggleVisibility = () => { setVisible(!visible) }
  return (
    <div>
      <div style={hideWhenVisible}>
        <button id={props.buttonId} onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

Toggleable.displayName = 'Togglable'
export default Toggleable