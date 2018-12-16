import React, { Component } from 'react';
import CardPlaceholder from '../Resources/Images/img.jpg';
import './game.css';

class Key extends Component {
  state = {
    style: {
      backgroundColor: '#519C3F'
    }
  };
  clickHandler = () => {
    this.setState({ style: { backgroundColor: '#DA6B44', textDecoration: 'line-through' } });
  };
  render() {
    return (
      <button style={{ ...this.state.style }} onClick={this.clickHandler} className='key'>
        {this.props.letter}
      </button>
    );
  }
}

class Keyboard extends Component {
  constructor(props) {
    super(props);
    this.alphabet = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z'
    ];
  }

  render() {
    return (
      <div className='keyboard'>
        {this.alphabet.map(key => (
          <Key key={this.alphabet.indexOf(key)} letter={key} />
        ))}
      </div>
    );
  }
}

class Card extends Component {
  render() {
    return (
      <div className='card'>
        <div className='card-title'>Card</div>
        <img className='card-image' src={CardPlaceholder} />
      </div>
    );
  }
}

class Cards extends Component {
  render() {
    return (
      <div className='cards'>
        <div className='cards-title'>{this.props.title ? this.props.title : ''}</div>
        <Card />
        <Card />
        <Card />
      </div>
    );
  }
}

class Content extends Component {
  render() {
    return (
      <div className='content'>
        <div className='game'>
          <div className='word'>_ _ _ _ _ _ _ _</div>
          <Keyboard />
        </div>
        <div className='deck-title'>Game deck:</div>
        <div className='deck'>
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    );
  }
}

class Game extends Component {
  state = {};
  render() {
    return (
      <div className='gameWrapper'>
        <Cards title='Your cards:' />
        <Content />
        <Cards title='Enemy cards:' />
      </div>
    );
  }
}

export default Game;
