import React, { Component } from 'react'
import "./Menu.css"

class Menu extends Component {
  state = {};
  render() {
    return (
      <div>
        <div className="content">
          <button onClick={this.props.gameStartHandler}>Game</button>
          <button>Help</button>
          <button>Options</button>
          <button>Credits</button>
        </div>
      </div>
    )
  }
}

export default Menu;
