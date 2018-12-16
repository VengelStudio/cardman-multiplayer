import React from 'react';
import Header from './Header/Header';
import About from './Components/About';
import './Styles/styles.css';
import './Styles/components.css';
import Popup from './Components/Popup';
import CardPlaceholder from './Resources/Images/img.jpg';

import Game from './Components/Game';
import Menu from './Components/Menu';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGameOpened: true
      /*popups: [
        {
          title: 'Welcome to Hangman!',
          content: ``,
          id: 0
        }
      ]*/
    };
  }
  gameStartHandler = () => {
    this.setState({ isGameOpened: true })
  }

  onPopupClose = id => {
    let newPopups = this.state.popups.filter(popup => {
      return popup.id !== id;
    });
    this.setState({ popups: newPopups });
  };

  render() {
    return (
      <div className='container of-rows width-full height-full text-nunito'>
        <div className='row width-full semi-bold bg-dark color-lightblue padding-sm height-sm text-lg content-hcenter content-vcenter'>
          <Header />
        </div>
        <div className='row width-full height-full bg-lightblue'>
          {this.state.popups &&
            this.state.popups.map(x => {
              return <Popup title={x.title} content={x.content} key={x.id} id={x.id} onClose={this.onPopupClose} />;
            })}
          {this.state.isGameOpened ? <Game /> : <Menu gameStartHandler={this.gameStartHandler} />}
        </div>
        <About />
      </div>
    );
  }
}

export default App;
