import React, { Component } from 'react'
import "./Menu.css"
import "./NicknameInput"
import NicknameInput from './NicknameInput';

class Menu extends Component {
  state = {
    isNicknamePassed: false
  };
  menuStartHandler = (inputValue) => {
    this.setState({ isNicknamePassed: true })
    this.setState({ nickname: inputValue })
  }
  render() {
    return (
      <React.Fragment>
        {
          this.state.isNicknamePassed ?
            <div className="menu">
              <button onClick={() => { this.props.gameStartHandler(this.state.nickname) }}>Game</button>
              <button>Help</button>
              <button>Options</button>
              <button>Credits</button>
            </div> : <NicknameInput menuStartHandler={this.menuStartHandler} />
        }
      </React.Fragment>
    )
  }
}

export default Menu;
