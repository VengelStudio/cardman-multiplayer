import React, { Component } from 'react'
import CardPlaceholder from '../../Resources/Images/img.jpg'
import './Game.css'

const { GAME_MOVE } = require('../../Events')

class Key extends Component {
  state = {
    style: {
      backgroundColor: '#519C3F'
    }
  }

  clickHandler = () => {
    this.props.moveHandler({ move: { type: 'key', key: this.props.letter } })
    this.setState({
      style: { backgroundColor: '#555', textDecoration: 'none' }
    })
  }

  render() {
    return (
      <button
        style={{ ...this.state.style }}
        onClick={this.clickHandler}
        className='key'
      >
        {this.props.letter}
      </button>
    )
  }
}

class Keyboard extends Component {
  generateKeys = () => {
    let result = []
    for (let i = 65; i <= 90; i++) {
      result.push(
        <Key
          moveHandler={this.props.moveHandler}
          key={i}
          letter={String.fromCharCode(i)}
        />
      )
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
        <img
          className='card-image border-neon border-light-translucent'
          src={CardPlaceholder}
          alt='Playing card.'
        />
      </div>
    )
  }
}

class Cards extends Component {
  render() {
    return (
      <div className='cards'>
        <div className='cards-title'>
          {this.props.title ? this.props.title : ''}
        </div>
        <Card type={this.props.type} />
        <Card type={this.props.type} />
        <Card type={this.props.type} />
      </div>
    )
  }
}

class Content extends Component {
  constructor(props) {
    super(props)
    this.state = { game: null }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.game !== state.game) {
      return {
        game: props.game
      }
    }
    return null
  }

  render() {
    return (
      <div className='content'>
        <div className='game'>
          <div className='word'>
            {this.state.game && this.state.game.displayWord}
          </div>
          <Keyboard moveHandler={this.props.moveHandler} />
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
  constructor(props) {
    super(props)
    this.state = { game: null }
  }

  componentWillMount() {
    this.initializeSocket()
  }

  initializeSocket = () => {
    const { socket } = this.props
    socket.on(GAME_MOVE, ({ game }) => {
      console.log(game)
    })
  }

  moveHandler = ({ move = null }) => {
    const { socket } = this.props
    console.log(move)
    console.log(this.state.game)
    socket.emit(GAME_MOVE, { game: this.state.game, move })
  }

  static getDerivedStateFromProps(props, state) {
    if (props.game !== state.game) {
      return {
        game: props.game
      }
    }
    return null
  }

  render() {
    return (
      <div className='gameWrapper'>
        {/* <Cards type={1} title='Your cards:' /> */}
        <Content moveHandler={this.moveHandler} game={this.state.game} />
        {/* <Cards type={-1} title='Enemy cards:' /> */}
      </div>
    )
  }
}

export default Game
