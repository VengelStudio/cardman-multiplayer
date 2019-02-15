import React, { Component } from 'react'
import './Game.css'
import Cards from './Cards'
import Content from './Content'
import { withRouter } from 'react-router-dom'

const { isMove } = require('../../Shared/Functions')
const { winHandler } = require('./Functions')
const { setScore } = require('../../Shared/Functions')
const { GAME_MOVE, WIN } = require('../../Shared/Events')

class Game extends Component {
    constructor(props) {
        super(props)
        this.state = {
            game: this.props.game,
            gameFromProps: true,
            allowMove: true
        }

        this.props.socket && this.initializeSocket()
    }

    initializeSocket = () => {
        const { socket } = this.props
        socket.on(GAME_MOVE, ({ game }) => {
            this.setState({ game: game }, () => {
                this.props.setMove(
                    isMove({ game: this.state.game, player: this.props.player })
                )
            })
        })
        socket.on(WIN, ({ winner, score, type, game }) => {
            let winObj = winHandler({
                type,
                setMove: this.props.setMove,
                setScore: setScore,
                setTitle: this.props.setTitle,
                score,
                game,
                addPopup: this.props.addPopup,
                winner,
                player: this.props.player,
                muteMusic: this.props.muteMusic,
                returnToMenu: () => {
                    this.props.history.push('/menu')
                }
            })
            this.setState({ ...winObj })
        })
    }

    static getDerivedStateFromProps(props, state) {
        if (state.gameFromProps) {
            if (props.game !== state.game) {
                setScore({
                    player: props.player,
                    game: props.game,
                    setTitle: props.setTitle
                })
                return {
                    gameFromProps: false,
                    game: props.game
                }
            }
            return null
        }
        return null
    }
    componentDidMount() {
        this.props.muteMusic(true)
    }
    moveHandler = ({ move = null }) => {
        if (this.state.allowMove === true) {
            const { socket } = this.props
            socket.emit(GAME_MOVE, { game: this.state.game, move })
        }
    }

    onMoveTimeout = () => {
        this.moveHandler({
            move: {
                type: 'key',
                key: '',
                playerSocketId: this.props.player.socketId
            }
        })
    }

    render() {
        return (
            <div className='gameWrapper'>
                <Cards type={1} move={this.props.isMove} title='Your cards:' />
                <Content
                    player={this.props.player}
                    moveHandler={this.moveHandler}
                    onMoveTimeout={this.onMoveTimeout}
                    move={this.props.isMove}
                    game={this.state.game}
                />
                <Cards
                    type={-1}
                    move={!this.props.isMove}
                    title='Enemy cards:'
                />
            </div>
        )
    }
}

export default withRouter(Game)
