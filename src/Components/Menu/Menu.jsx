import React, { Component } from 'react';
import './Menu.css';
import WelcomePage from './WelcomePage/WelcomePage';

class Menu extends Component {
  state = {
    isNicknamePassed: false
  };
  menuStartHandler = inputValue => {
    this.setState({ isNicknamePassed: true });
    this.setState({ nickname: inputValue });
  };
  render() {
    return (
      <React.Fragment>
        <div className='menu'>
          {this.state.isNicknamePassed ? (
            <React.Fragment>
              <button
                className='border-neon border-neon-red'
                onClick={() => {
                  this.props.gameStartHandler(this.state.nickname);
                }}
              >
                Game
              </button>
              <button className='border-neon border-neon-orange'>Help</button>
              <button className='border-neon border-neon-violet'>Options</button>
              <button className='border-neon border-neon-lime'>Credits</button>
            </React.Fragment>
          ) : (
            <WelcomePage menuStartHandler={this.menuStartHandler} />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Menu;
