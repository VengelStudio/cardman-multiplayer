import React, { Component } from 'react'

class NicknameInput extends Component {
  state = {}
  render() {
    return (
      <React.Fragment>
        <div className="infoNickname"><span>Please enter your nickname</span></div>
        <div className="nickname-input">
          <input type="text" className="inputNickname"></input>
          <button onClick={this.props.menuStartHandler}>SUBMIT</button>
        </div>
      </React.Fragment>
    );
  }
}

export default NicknameInput;