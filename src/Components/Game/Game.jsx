import React, { Component } from 'react'
import './Game.css'
import Cards from './Cards'
import Content from './Content'
import { withRouter } from 'react-router-dom'
import { POPUP_GAME_END, POPUP_GENERIC } from '../Popup/Types'
import { isMove, setScore } from './Functions'

const { GAME_MOVE, WIN } = require('../../Shared/Events')

let winHandler = ({
    type,
    setMove = null,
    setScore = null,
    setTitle = null,
    score = null,
    game = null,
    addPopup = null,
    winner = null,
    player = null
}) => {
    let returnState = null
    if (type === 'turn') {
        returnState = { gameFromProps: false, game }
        setMove(isMove({ game, player }))
    } else if (type === 'turn_tie') {
        returnState = { gameFromProps: false, game }
        setMove(isMove({ game, player }))
        addPopup({
            title: 'TIE',
            type: POPUP_GENERIC,
            content: `Turn is tied. None of the players won.`
        })
    } else if (type === 'game') {
        //* win
        //todo if win === true disable any interactions
        returnState = { allowMove: false }
        addPopup({
            title: 'WINNER',
            type: POPUP_GAME_END,
            content: `winner: ${winner.nickname}`
        })
    }
    setScore({
        player,
        game,
        setTitle,
        score
    })
    return returnState
}

class Game extends Component {
    constructor(props) {
        super(props)
        this.state = {
            game: this.props.game,
            gameFromProps: true,
            move: this.props.isMove,
            allowMove: true
        }

        // if (this.props.game === null) {
        //   console.log('DETECTED RELOAD, MOVE TO MAIN MENU')
        //   this.props.history.push('/')
        // }

        //todo create a "Disconnected" error popup
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
        //todo doesn't work for R E D E S I G N I N G
        //todo pass enemy to setScore
        socket.on(WIN, ({ winner, score, type, game }) => {
            console.log(game)
            let winObj = winHandler({
                type,
                setMove: this.props.setMove,
                setScore,
                setTitle: this.props.setTitle,
                score,
                game,
                addPopup: this.props.addPopup,
                winner,
                player: this.props.player
            })
            console.log(winObj)
            this.setState({ ...winObj })
            // if (type === 'turn') {
            //     this.setState({ gameFromProps: false, game }, () => {
            //         this.props.setMove(isMove({ props: this.state }))
            //     })
            // } else if (type === 'turn_tie') {
            //     this.setState({ gameFromProps: false, game }, () => {
            //         this.props.setMove(isMove({ props: this.state }))
            //     })
            //     this.props.addPopup({
            //         title: 'TIE',
            //         type: POPUP_GENERIC,
            //         content: `Turn is tied. None of the players won.`
            //     })
            // } else {
            //     this.setState(
            //         { allowMove: false },
            //         //todo if win === true disable any interactions
            //         this.props.addPopup({
            //             title: 'WINNER',
            //             type: POPUP_GAME_END,
            //             content: `winner: ${winner.nickname}`
            //         })
            //     )
            // }
            // setScore({ props: this.props, score })
        })
    }

    moveHandler = ({ move = null }) => {
        if (this.state.allowMove === true) {
            const { socket } = this.props
            socket.emit(GAME_MOVE, { game: this.state.game, move })
        }
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

    render() {
        return (
            <div className='gameWrapper'>
                <Cards type={1} move={this.props.isMove} title='Your cards:' />
                <Content
                    player={this.props.player}
                    moveHandler={this.moveHandler}
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
