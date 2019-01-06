import React, { Component } from 'react'
import './LoginPage.css'
import { VERIFY_USERNAME } from '../../../Events'

class LoginPage extends Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }

  loginHandler = () => {
    let nickname = this.inputRef.current.value
    const { socket } = this.props
    if (nickname.length <= 1) {
      this.props.addPopup('<p>Your nickname has to be longer.</p>')
      return
    }
    socket.emit(VERIFY_USERNAME, nickname, ({ player, isTaken }) => {
      if (isTaken) {
        //!this.props.addPopup('<p>This nickname is already taken.</p>')
      } else {
        this.props.setTitle({ title: 'Menu' })
        this.props.loginPlayer(player)
      }
    })
  }

  submitOnEnter = key => {
    if (key.which === 13) {
      this.loginHandler()
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className='menu'>
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
            <button className='button-pointer border-neon border-neon-orange' onClick={this.loginHandler}>
              SUBMIT
            </button>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default LoginPage
