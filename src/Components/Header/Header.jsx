import React, { Component } from 'react';
import './Header.css';

class Header extends Component {
  render() {
    return (
      <div className='row header width-full semi-bold bg-dark color-lightblue padding-sm height-sm text-lg content-hcenter content-vcenter'>
        <div className='column auto has-background-dark header'>
          <h1 className='title has-text-white-ter'>
            {this.props.enemyNickname ? `You're playing against ${this.props.enemyNickname}` : 'Hangman Multiplayer'}
          </h1>
        </div>
      </div>
    );
  }
}

export default Header;
