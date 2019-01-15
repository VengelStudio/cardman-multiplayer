import React, { Component } from 'react'
import './Game.css'
import Cards from './Cards'
import Content from './Content'

const { GAME_MOVE } = require('../../Events')

const setScore = ({ props }) => {
  let myNickname = props.player.nickname

  // let me = props.game.playerSockets.filter(p => {
  //   return p.id === props.player.id
  // })<(-_-)>

  let enemy = props.game.playerSockets.filter(p => {
    return p.id !== props.player.id
  })

  let enemyNickname = enemy[0].nickname
  props.setTitle({ title: `${myNickname} 0:0 ${enemyNickname}` })
}

const isMove = ({ props }) => {
  let nextPlayerIndex = props.game.nextPlayerIndex
  console.log(nextPlayerIndex)
  console.log(props.game.playerSockets)
  console.log(props.game.playerSockets[nextPlayerIndex])
  console.log(props.game)
  console.log(props.player)
  return props.game.playerSockets[nextPlayerIndex].id === props.player.id
}

class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      player: this.props.player,
      game: this.props.game,
      gameFromProps: true,
      move: true
    }
    this.initializeSocket()
  }

  initializeSocket = () => {
    const { socket } = this.props
    socket.on(GAME_MOVE, ({ game }) => {
      this.setState({ game: game }, () => {
        this.setState({ move: isMove({ props: this.state }) })
      })
      setScore({ props: this.props })
    })
  }

  moveHandler = ({ move = null }) => {
    const { socket } = this.props
    socket.emit(GAME_MOVE, { game: this.state.game, move })
  }

  static getDerivedStateFromProps(props, state) {
    if (state.gameFromProps) {
      if (props.game !== state.game) {
        setScore({ props })
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
        <Cards type={1} move={this.state.move} title='Your cards:' />
        <Content moveHandler={this.moveHandler} game={this.state.game} />
        <Cards type={-1} move={!this.state.move} title='Enemy cards:' />
      </div>
    )
  }
}

export default Game
