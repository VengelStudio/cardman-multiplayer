import React, { Component } from 'react'

class NicknameInput extends Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }
  state = {}
  clickHandler = () => {
    let inputValue = this.inputRef.current.value
    this.props.menuStartHandler(inputValue)
  }
  render() {
    return (
      <React.Fragment>
        <div className="infoNickname"><span>Please enter your nickname</span></div>
        <div className="nickname-input">
          <input ref={this.inputRef} type="text" className="inputNickname"></input>
          <button onClick={this.clickHandler}>SUBMIT</button>
        </div>
      </React.Fragment>
    );
  }
}

export default NicknameInput;