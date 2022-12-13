import React from 'react'


const Login = (props) => {
  return (
    <form onSubmit={props.handleLogin}>
      <div>
        <label htmlFor='username-input'>username&nbsp;</label>
        <input
          onChange={props.handleUsernameChange}
          value={props.username}
          name='Username'
          type='text'
          id='username-input'
        >
        </input>
      </div>
      <div>
        <label htmlFor='password-input'>password&nbsp;</label>
        <input
          onChange={props.handlePasswordChange}
          value={props.password}
          name='Password'
          type='text'
          id='password-input'
        >
        </input>
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default Login