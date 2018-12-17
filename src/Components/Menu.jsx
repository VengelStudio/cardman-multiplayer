import React, { Component } from 'react'
import "./Menu.css"
import "./NicknameInput"
import NicknameInput from './NicknameInput';

class Menu extends Component {
  state = { isNicknamePassed: false };
  menuStartHandler = () => {
    this.setState({ isNicknamePassed: true })
    console.log("XD")
  }
  render() {
    return (
      <React.Fragment>
        {
          this.state.isNicknamePassed ?
            <div className="menu">
              <button onClick={this.props.gameStartHandler}>Game</button>
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
