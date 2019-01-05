import React, { Component } from 'react';
import './Credits.css';

class Credits extends Component {
  state = {}
  render() {
    return (
      <React.Fragment>
        <div className="container of-rows credits-wrapper border-neon border-neon-red bg-dark text-nunito text-xlg">
          <div className="logos">
            <img src="https://goo.gl/LjGLVJ" className="logo"></img>
            <a href=" https://github.com/VengelStudio">
              <img src="https://goo.gl/UHGvzL" className="logo"></img>
            </a>
          </div>
          <p className="credits-header">Hangman Multiplayer</p>
          <p className="test-xlg">Created By:</p>
          <div className="developers-content">
            <p>Bartosz Kępka</p>
            <p>Łukasz Blachnicki</p>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Credits;