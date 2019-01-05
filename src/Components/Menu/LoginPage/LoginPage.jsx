import React, { Component } from 'react'
import './LoginPage.css'

class LoginPage extends Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }

  submitOnEnter = key => {
    if (key.which === 13) {
      this.clickHandler()
    }
  }

  clickHandler = () => {
    let nickname = this.inputRef.current.value
    this.props.loginHandler(nickname)
  }

  render() {
    return (
      <React.Fragment>
        <div className='infoNickname border-neon border-neon-violet'>
          <p>Please enter your nickname</p>
        </div>
        <div className='nickname-input'>
          <input
            ref={this.inputRef}
            type='text'
            maxLength='15'
            className='inputNickname border-neon border-neon-red'
            onKeyDown={this.submitOnEnter}
          />
          <button className='border-neon border-neon-orange' onClick={this.clickHandler}>
            SUBMIT
          </button>
        </div>
      </React.Fragment>
    )
  }
}

export default LoginPage
