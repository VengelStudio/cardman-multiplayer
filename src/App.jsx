import React from 'react';
import Header from './Header/Header';
import About from './Components/About';
import 'normalize.css';
import './Styles/styles.css';
import './Styles/components.css';
import Popup from './Components/Popup';
import CardPlaceholder from './Resources/Images/img.jpg';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGameOpened: false,
      popups: [
        {
          title: 'Welcome to Hangman!',
          content: `
      <span style={display:block; margin:auto;}><center>The main goal is to guess a randomly generated word.<br>
      <b>However, it's not a piece of cake as you may think.</b><br>
      You're competing with other players. Your speed and certainty are what counts.<br><br>
      <b>Our game features unique playing cards:</b><br><br>
      <img class="card-placeholder" src=${CardPlaceholder}>
      <img class="card-placeholder" src=${CardPlaceholder}>
      <img class="card-placeholder" src=${CardPlaceholder}>
      <img class="card-placeholder" src=${CardPlaceholder}>
      <img class="card-placeholder" src=${CardPlaceholder}>
      <img class="card-placeholder" src=${CardPlaceholder}>
      </center></span>
      `,
          id: 0
        }
      ]
    };
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
          {this.state.popups.map(x => {
            return <Popup title={x.title} content={x.content} key={x.id} id={x.id} onClose={this.onPopupClose} />;
          })}
        </div>
        <About />
      </div>
    );
  }
}

export default App;
