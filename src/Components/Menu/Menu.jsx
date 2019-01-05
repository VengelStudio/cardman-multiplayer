import React, { Component } from 'react'
import './Menu.css'
import LoginPage from './LoginPage/LoginPage'
import { VERIFY_USERNAME } from '../../Events'

class Menu extends Component {
  state = {
    showMenu: false
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
        this.setState({ showMenu: true }, () => {
          this.props.setTitle({ title: 'Menu' })
        })
        this.props.loginPlayer(player)
      }
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className='menu'>
          {this.state.showMenu ? (
            <React.Fragment>
              <button
                className='button-pointer border-neon border-neon-red'
                onClick={() => {
                  this.props.menuPlayHandler(this.state.nickname)
                }}
              >
                Start
              </button>
              <button className='button-pointer border-neon border-neon-orange'>Help</button>
              <button className='button-pointer border-neon border-neon-violet' onClick={this.props.optionsViewHandler}>
                Options
              </button>
              <button className='button-pointer border-neon border-neon-lime' onClick={this.props.creditsViewHandler}>
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
