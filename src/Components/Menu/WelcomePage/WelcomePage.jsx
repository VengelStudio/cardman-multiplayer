import React, { Component } from 'react';
import './WelcomePage.css';

class WelcomePage extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }
  state = {};
  submitOnEnter = (key) => {
    if (key.which === 13) {
      this.clickHandler();
    }
  }
  clickHandler = () => {
    let inputValue = this.inputRef.current.value;
    console.log(inputValue)
    this.props.menuStartHandler(inputValue)
  };
  render() {
    return (
      <React.Fragment>
        <div className='infoNickname border-neon border-neon-violet'>
          <p>Please enter your nickname</p>
        </div>
        <div className='nickname-input'>
          <input ref={this.inputRef} type='text' className='inputNickname border-neon border-neon-red' onKeyDown={this.submitOnEnter} />
          <button className='border-neon border-neon-orange' onClick={this.clickHandler} >
            SUBMIT
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default WelcomePage;
