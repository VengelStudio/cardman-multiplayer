import React, { Component } from 'react'
import CardPlaceholder from '../../Resources/Images/img.jpg'
import './Game.css'

class Key extends Component {
  state = {
    style: {
      backgroundColor: '#519C3F'
    }
  }
  clickHandler = () => {
    this.setState({
      style: { backgroundColor: '#555', textDecoration: 'none' }
    })
  }
  render() {
    return (
      <button style={{ ...this.state.style }} onClick={this.clickHandler} className='key'>
        {this.props.letter}
      </button>
    )
  }
}

class Keyboard extends Component {
  generateKeys = () => {
    let result = []
    for (let i = 65; i <= 90; i++) {
      result.push(<Key key={i} letter={String.fromCharCode(i)} />)
    }
    return result
  }

  render() {
    return (
      <div className='keyboard border-neon border-light-translucent'>
        {this.generateKeys().map(key => {
          return key
        })}
      </div>
    )
  }
}

class Card extends Component {
  getBorder = () => {
    let classes = 'card border-neon '
    switch (this.props.type) {
      case 1:
        classes += 'border-neon-lime'
        break
      case -1:
        classes += 'border-neon-red'
        break
      default:
        classes += 'border-neon-violet'
        break
    }
    return classes
  }

  render() {
    return (
      <div className={this.getBorder()}>
        <div className='card-title'>Card</div>
        <img className='card-image border-neon border-light-translucent' src={CardPlaceholder} alt='Playing card.' />
      </div>
    )
  }
}

class Cards extends Component {
  render() {
    return (
      <div className='cards'>
        <div className='cards-title'>{this.props.title ? this.props.title : ''}</div>
        <Card type={this.props.type} />
        <Card type={this.props.type} />
        <Card type={this.props.type} />
      </div>
    )
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
        {/* <div className="deck-title">Game deck:</div>
				<div className="deck">
					<Card type={0} />
					<Card type={0} />
					<Card type={0} />
					<Card type={0} />
					<Card type={0} />
				</div> */}
      </div>
    )
  }
}

class Game extends Component {
  state = {}
  render() {
    return (
      <div className='gameWrapper'>
        <Cards type={1} title='Your cards:' />
        <Content />
        <Cards type={-1} title='Enemy cards:' />
      </div>
    )
  }
}

export default Game
