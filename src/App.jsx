import React from 'react';
import './App.css';

import Header from './Components/Header/Header';
import About from './Components/About/About';
import Popup from './Components/Popup/Popup';
import Game from './Components/Game/Game';
import Menu from './Components/Menu/Menu';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGameOpened: false,
      nickname: null,
      popups: [],
      lastPopupId: 0,
    };
  }
  addPopup = (content) => {
    this.setState({ popups: [...this.state.popups, { id: this.state.lastPopupId, content: content }] })
    this.setState((prevState, props) => {
      lastPopupId: prevState.lastPopupId++
    })
  }
  gameStartHandler = nickname => {
    this.setState({ isGameOpened: true });
    console.log(nickname);
    this.setState({ nickname: nickname });
  };

  onPopupClose = id => {
    let newPopups = this.state.popups.filter(popup => {
      return popup.id !== id;
    });
    this.setState({ popups: newPopups });
  };

  passNickname = () => { };

  render() {
    return (
      <div className='container of-rows width-full height-full text-nunito '>
        <Header title={this.state.title} />
        <div className='row width-full height-full bg-lightgrey'>
          {this.state.popups &&
            this.state.popups.map(x => {
              return <Popup title={x.title} content={x.content} key={x.id} id={x.id} onClose={this.onPopupClose} />;
            })}
          {this.state.isGameOpened ? (
            <Game />
          ) : (
              <Menu addPopup={this.addPopup} gameStartHandler={this.gameStartHandler} nickPopup={this.passNickname} />
            )}
        </div>
        <About />
      </div>
    );
  }
}

export default App;
