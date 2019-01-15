import React, { Component } from 'react'
import CardPlaceholder from '../../Resources/Images/img.jpg'
import './Game.css'

const { GAME_MOVE } = require('../../Events')

class Key extends Component {
  state = {
    clicked: this.props.clicked
  }

  static getDerivedStateFromProps(props, state) {
    if (props.clicked !== state.clicked) {
      return {
        clicked: props.clicked
      }
    }
    return null
  }

  clickHandler = () => {
    this.props.moveHandler({ move: { type: 'key', key: this.props.letter } })
  }

  render() {
    return (
      <button
        style={
          this.state.clicked
            ? { backgroundColor: '#555', textDecoration: 'none' }
            : {
                backgroundColor: '#519C3F'
              }
        }
        onClick={this.clickHandler}
        className='key'
      >
        {this.props.letter}
      </button>
    )
  }
}

class Keyboard extends Component {
  constructor(props) {
    super(props)
    this.state = { guessed: this.props.guessed }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.guessed !== state.guessed) {
      return {
        guessed: props.guessed
      }
    }
    return null
  }

  generateKeys = () => {
    let result = []
    for (let i = 65; i <= 90; i++) {
      let letter = String.fromCharCode(i).toUpperCase()
      let clicked = false
      if (this.props.guessed.includes(letter)) {
        clicked = true
      }

      result.push(
        <Key
          moveHandler={this.props.moveHandler}
          key={i}
          letter={letter}
          clicked={clicked}
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
    this.state = { game: this.props.game }
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
          {this.state.game && (
            <Keyboard
              moveHandler={this.props.moveHandler}
              guessed={this.props.game.guessed}
            />
          )}
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
    this.state = { game: this.props.game, gameFromProps: true }
    this.initializeSocket()
  }

  initializeSocket = () => {
    const { socket } = this.props
    socket.on(GAME_MOVE, ({ game }) => {
      console.log(this.state.game)
      //todo add the rest of parameters
      console.log(game)
      let newWord = game.displayWord
      console.log('new word: ' + newWord)
      //this.setState({ game: { displayWord: newWord } })
      this.setState({ game: game })
      //this.setState(prevState => ({ game: { ...prevState.game, ...game } }))

      console.log(this.state.game)
    })
  }

  moveHandler = ({ move = null }) => {
    const { socket } = this.props
    socket.emit(GAME_MOVE, { game: this.state.game, move })
  }

  static getDerivedStateFromProps(props, state) {
    if (state.gameFromProps) {
      if (props.game !== state.game) {
        return {
          gameFromProps: false,
          game: props.game
        }
      }
      return null
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
