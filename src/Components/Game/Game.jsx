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
            allowMove: true,
            myCards: null,
            enemyCards: null,
            cardTargetHighlight: false
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
            console.log(game)
            let winObj = winHandler({
                type,
                setScore,
                score,
                game,
                winner,
                props: this.props,
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

    getCards = () => {
        let cards = { my: null, enemy: null }
        if (this.props.game !== null) {
            let gameCards = this.props.game.cards
            let mySocketId = this.props.player.socketId
            cards.my = gameCards[mySocketId]
            let enemySocketId = this.props.game.playerSockets.filter(x => {
                return x.socketId !== this.props.player.socketId
            })[0].socketId
            cards.enemy = gameCards[enemySocketId]
        }
        return cards
    }

    setCardTargetHighlight = bool => {
        this.setState({ cardTargetHighlight: bool })
    }

    render() {
        let cards = this.getCards()
        return (
            <div className='gameWrapper'>
                <Cards
                    cards={cards.my}
                    displayTooltip={true}
                    move={this.props.isMove}
                    title='Your cards:'
                    soundVolume={this.props.soundVolume}
                    setCardTargetHighlight={this.setCardTargetHighlight}
                />
                <Content
                    player={this.props.player}
                    moveHandler={this.moveHandler}
                    onMoveTimeout={this.onMoveTimeout}
                    move={this.props.isMove}
                    game={this.state.game}
                    isCardTargetHighlight={this.state.cardTargetHighlight}
                />
                <Cards
                    cards={cards.enemy}
                    displayTooltip={false}
                    move={!this.props.isMove}
                    title='Enemy cards:'
                    soundVolume={this.props.soundVolume}
                    setCardTargetHighlight={this.setCardTargetHighlight}
                />
            </div>
        )
    }
}

export default withRouter(Game)
