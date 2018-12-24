import React, { Component } from 'react';
import './Options.css';

class Options extends Component {
  state = {}
  render() {
    return (
      <React.Fragment>
        <div className="optionsWrapper border-neon border-neon-violet bg-dark text-nunito">
          <div className="optionsContent">
            <span>
              <span>Change nickname: </span>
              <input className="changeNickname border-neon border-neon-violet"></input>
            </span>
            <span className="countryOptions">
              <p>Country: </p>
              <img className="country-image-in-options" src='https://www.countryflags.io/pl/flat/64.png' />
            </span>
            <span>
            <span>Music volume: </span><input type="range" className="slider-neon border-neon border-neon-violet"></input>
            <br></br>
            <span>Sound volume: </span><input type="range" className="slider-neon border-neon border-neon-violet"></input>
            </span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Options;