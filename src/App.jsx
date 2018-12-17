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
      title: null
      // popups: [
      //   {
      //     title: 'Welcome to Hangman!',
      //     content: ``,
      //     id: 0
      //   }
      // ]
    };
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

  passNickname = () => {};

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
            <Menu gameStartHandler={this.gameStartHandler} nickPopup={this.passNickname} />
          )}
        </div>
        <About />
      </div>
    );
  }
}

export default App;
