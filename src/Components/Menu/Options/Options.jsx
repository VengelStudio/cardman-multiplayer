import React, { Component } from 'react';
import './Options.css';

class Options extends Component {
  state = {}
  render() {
    return (
      <React.Fragment>
        <div className="optionsWrapper border-neon border-neon-violet bg-dark text-nunito">
          <div className="optionsContent">
            <p>Change nickname: </p>
            <span className="countryOptions">
              <p>Country: </p>
              <img className="country-image-in-options" src='https://www.countryflags.io/pl/flat/64.png' />
            </span>
            <p>Music volume: </p>
            <p>Sound volume: </p>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Options;