import React, { Component } from 'react'
import './Menu.css'
import LoginPage from './LoginPage/LoginPage'
import { VERIFY_USERNAME } from '../../Events'

class Menu extends Component {
  state = {
    isNicknamePassed: false
  }

  loginHandler = nickname => {
    const { socket } = this.props
    if (nickname.length <= 1) {
      this.props.addPopup('<p>Your nickname has to be longer.</p>')
      return
    }
    socket.emit(VERIFY_USERNAME, nickname, ({ player, isTaken }) => {
      console.log('callback', player, isTaken)
      if (isTaken) {
        this.props.addPopup('<p>This nickname is already taken.</p>')
      } else {
        this.setState({ isNicknamePassed: true })
        this.props.setPlayer(player)
      }
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className='menu'>
          {this.state.isNicknamePassed ? (
            <React.Fragment>
              <button
                className='border-neon border-neon-red'
                onClick={() => {
                  this.props.menuPlayHandler(this.state.nickname)
                }}
              >
                Start
              </button>
              <button className='border-neon border-neon-orange'>Help</button>
              <button className='border-neon border-neon-violet' onClick={this.props.optionsStartHandler}>
                Options
              </button>
              <button className='border-neon border-neon-lime' onClick={this.props.creditsStartHandler}>
                Credits
              </button>
            </React.Fragment>
          ) : (
            <LoginPage loginHandler={this.loginHandler} />
          )}
        </div>
      </React.Fragment>
    )
  }
}

export default Menu
