import React, { Component } from 'react'
import './Game.css'
import Cards from './Cards'
import Content from './Content'
import { withRouter } from 'react-router-dom'

const { GAME_MOVE, WIN } = require('../../Events')

const setScore = ({ props, score = null }) => {
  let myNickname = props.player.nickname

  let me = props.game.playerSockets.filter(p => {
    return p.socketId === props.player.socketId
  })
  console.log(score);
  console.log(me);


  let myScore = (score === null) ? 0 : score[me[0].socketId]

  let enemy = props.game.playerSockets.filter(p => {
    return p.socketId !== props.player.socketId
  })
  let enemyScore = (score === null) ? 0 : score[enemy[0].socketId]

  let enemyNickname = enemy[0].nickname
  props.setTitle({ title: `${myNickname} ${myScore}:${enemyScore} ${enemyNickname}` })
}

const isMove = ({ props }) => {
  let nextPlayerIndex = props.game.nextPlayerIndex
  return props.game.playerSockets[nextPlayerIndex].id === props.player.id
}

class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      player: this.props.player,
      game: this.props.game,
      gameFromProps: true,
      move: this.props.isMove
    }

    // if (this.props.game === null) {
    //   console.log('DETECTED RELOAD, MOVE TO MAIN MENU')
    //   this.props.history.push('/')
    // }

    //todo make an "Disconnected" error
    this.props.socket && this.initializeSocket()
  }

  initializeSocket = () => {
    const { socket } = this.props
    socket.on(GAME_MOVE, ({ game }) => {
      this.setState({ game: game }, () => {
        this.props.setMove(isMove({ props: this.state }))
        console.log(isMove({ props: this.state }))
      })
    })
    socket.on(WIN, ({ winner, score }) => {
      console.log(winner)
      console.log(score)

      this.props.addPopup({
        title: 'WINNER',
        content: `winner: ${winner.nickname}`,
      })
      setScore({ props: this.props, score })
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
        <Cards type={1} move={this.props.isMove} title='Your cards:' />
        <Content moveHandler={this.moveHandler} game={this.state.game} />
        <Cards type={-1} move={!this.props.isMove} title='Enemy cards:' />
      </div>
    )
  }
}

export default withRouter(Game)
