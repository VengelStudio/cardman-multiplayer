import React, { Component } from 'react';
import './Credits.css';

class Credits extends Component {
  state = {}
  render() {
    return (
      <React.Fragment>
        <div className="container of-rows credits-wrapper border-neon border-neon-red bg-dark text-nunito text-xlg">

          <p className="text-xlg">Hangman Multiplayer</p>
          <p className="text-lg">Created By:</p>
          <p className="text-md">Vengel Studio</p>
          <p className="text-lg">Developers:</p>
          <p className="text-md">Bartosz Kępka</p>
          <p className="text-md">Łukasz Blachnicki</p>

        </div>
      </React.Fragment>
    );
  }
}

export default Credits;