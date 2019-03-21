import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import PropTypes from 'prop-types'
import ReactAudioPlayer from 'react-audio-player'
import discardSound from '../../Resources/Sounds/card_drop.mp3'
import flipSound1 from '../../Resources/Sounds/card_flip.mp3'
import flipSound2 from '../../Resources/Sounds/card_flip2.mp3'
import flipSound3 from '../../Resources/Sounds/card_flip3.mp3'
import buttonClick from '../../Resources/Sounds/button_click.mp3'

import './Game.css'
import Cards from './Cards/Cards'
import Content from './Content'
import GenericModal from '../Modals/GenericModal'
import CardModal from '../Modals/CardModal'

const { Cards: CardsData } = require('../../Game/Cards/Cards')
const { setScore, isMove } = require('../../Shared/Functions')
const { GAME_MOVE, WIN } = require('../../Shared/Events')
const { Result } = require('../../Shared/Enums')

class Game extends Component {
    state = {
        game: this.props.game,
        gameFromProps: true,
        allowMove: true,
        soundSrc: '',
        isDiscardEnabled: false,
        guessedWordModal: null,
        isTieModal: false,
        gameEndWinnerModal: null,
        wordDefinition: null,
        isMoveModal: false,
        isPeekModal: false,
        peekCardId: null,
        peekDescription: null,

        keyMove: null,
        cardMoves: [],
        myCards: null,
        enemyCards: null
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
            const { setMove, setTitle, player } = this.props
            let returnState = null
            if (type === Result.TURN_WIN) {
                returnState = { gameFromProps: false, game }
                setMove(isMove({ game, player }))
            } else if (type === Result.TURN_TIE) {
                returnState = { gameFromProps: false, game }
                setMove(isMove({ game, player }))
                this.setState({ isTieModal: true })
            } else if (type === Result.GAME_WIN) {
                returnState = { allowMove: false }
                this.setState({ gameEndWinnerModal: winner.nickname })
            }

            if (
                type === Result.TURN_WIN ||
                type === Result.TURN_TIE ||
                type === Result.GAME_WIN
            ) {
                this.setState({ guessedWordModal: this.state.game.word.word })
            }

            setScore({
                player,
                game,
                setTitle,
                score
            })

            this.setState({ ...returnState })
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

    ctrlPressHandler(event, isDown) {
        let { player, isMove } = this.props
        let { game } = this.state
        if (player !== null && game !== null) {
            let mySocketId = player.socketId
            let myBlocked = game.blockCounters[mySocketId]
            if (isMove && myBlocked <= 0) {
                if (event.keyCode === 17) {
                    this.setState({ isDiscardEnabled: isDown })
                }
            } else {
                if (event.keyCode === 17) {
                    this.setState({ isDiscardEnabled: false })
                }
            }
        }
    }
    componentDidMount() {
        this.props.socket && this.initializeSocket()
        this.props.muteMusic(true)
        document.addEventListener(
            'keydown',
            e => {
                this.ctrlPressHandler(e, true)
            },
            false
        )
        document.addEventListener(
            'keyup',
            e => {
                this.ctrlPressHandler(e, false)
            },
            false
        )
    }
    componentWillUnmount() {
        document.removeEventListener(
            'keydown',
            e => {
                this.ctrlPressHandler(e, false)
            },
            false
        )
        document.removeEventListener(
            'keyup',
            e => {
                this.ctrlPressHandler(e, false)
            },
            false
        )
    }

    onMove = () => {
        if (this.state.keyMove !== null || this.state.cardMoves.length > 0) {
            if (this.props.isMove && this.state.allowMove) {
                this.playSound(flipSound3)

                let { keyMove, cardMoves } = this.state
                cardMoves.forEach(e => {
                    if (e.discarded === false) {
                        if (e.card === CardsData.DEFINITION_CARD.id) {
                            let { definitions } = this.props.game.word
                            let randomIndex = Math.floor(
                                Math.random() * definitions.length
                            )
                            this.setState({
                                wordDefinition: definitions[randomIndex]
                            })
                        } else if (e.card === CardsData.LOOK_UP_CARD.id) {
                            let enemySocket = this.props.game.playerSockets.filter(
                                x => {
                                    return (
                                        x.socketId !==
                                        this.props.player.socketId
                                    )
                                }
                            )[0].socketId
                            let enemyCards = this.props.game.cards[enemySocket]
                            let randomIndexOfCard = Math.floor(
                                Math.random() * enemyCards.length
                            )
                            let randomEnemyCard =
                                enemyCards[randomIndexOfCard].id
                            let { description } = CardsData[randomEnemyCard]
                            this.setState({
                                isPeekModal: true,
                                peekCardId: enemyCards[randomIndexOfCard].id,
                                peekDescription: description
                            })
                        }
                    }
                })

                const { socket } = this.props
                let moves = []
                if (keyMove !== null) moves.push(keyMove)
                if (cardMoves !== []) moves = [...moves, ...cardMoves]

                this.setState({
                    keyMove: null,
                    cardMoves: []
                })
                socket.emit(GAME_MOVE, { game: this.state.game, moves })
            }
        } else {
            this.setState({
                isMoveModal: true
            })
        }
    }

    onMoveTimeout = () => {
        this.setState(
            {
                keyMove: {
                    type: 'key',
                    key: '',
                    playerSocketId: this.props.player.socketId
                },
                cardMoves: []
            },
            () => {
                this.onMove()
            }
        )
    }

    onUseAbort = index => {
        let { cardMoves } = this.state
        cardMoves = cardMoves.filter(card => {
            return card.index !== index
        })
        this.playSound(flipSound2)
        this.setState({ cardMoves })
    }

    playSound = src => {
        this.setState({ soundSrc: src })
    }

    onKeyMove = move => {
        if (this.props.isMove) {
            this.playSound(buttonClick)
            this.setState({ keyMove: move })
        }
    }

    clearKeyMove = () => {
        this.setState({
            keyMove: null,
            clickedIndex: null
        })
    }

    onCardUse = data => {
        if (this.props.isMove) {
            let move = {
                index: data.index,
                type: 'card',
                card: data.cardId,
                playerSocketId: this.props.player.socketId,
                discarded: false
            }

            let isDuplicate = this.state.cardMoves.some(
                cardMove => cardMove.index === data.index
            )
            if (isDuplicate === false) {
                setTimeout(() => {
                    this.playSound(flipSound1)
                }, 100)
                this.setState({ cardMoves: [...this.state.cardMoves, move] })
            }
        }
    }

    onDiscard = (index, cardId) => {
        let playerSocketId = this.props.player.socketId

        let newMove = {
            index,
            type: 'card',
            card: cardId,
            playerSocketId,
            discarded: true
        }
        let { cardMoves } = this.state
        cardMoves = cardMoves.filter(move => {
            return move.index + cardMoves.length !== index
        })
        cardMoves.push(newMove)
        this.setState({ cardMoves })

        let game = this.state.game
        game.cards[playerSocketId] = game.cards[playerSocketId].filter(
            (e, i) => {
                return i !== index
            }
        )
        setTimeout(() => {
            this.playSound(discardSound)
        }, 100)
        this.setState({ game })
    }

    render() {
        let cards = { my: null, enemy: null }
        if (this.state.game !== null) {
            let gameCards = this.state.game.cards
            let mySocketId = this.props.player.socketId
            cards.my = gameCards[mySocketId]
            let enemySocketId = this.state.game.playerSockets.filter(x => {
                return x.socketId !== this.props.player.socketId
            })[0].socketId
            cards.enemy = gameCards[enemySocketId]
        }
        return (
            <div className='gameWrapper'>
                {this.state.wordDefinition && (
                    <GenericModal
                        title='Word definition:'
                        content={this.state.wordDefinition}
                        onClose={() => this.setState({ wordDefinition: null })}
                        volumeSettings={this.props.volumeSettings}
                    />
                )}
                {this.state.isMoveModal && (
                    <GenericModal
                        title='Cannot continue!'
                        content='You have to make a a move.'
                        onClose={() => this.setState({ isMoveModal: false })}
                        volumeSettings={this.props.volumeSettings}
                    />
                )}
                {this.state.isPeekModal && (
                    <CardModal
                        cardId={this.state.peekCardId}
                        description={this.state.peekDescription}
                        onClose={() => this.setState({ isPeekModal: false })}
                        volumeSettings={this.props.volumeSettings}
                    />
                )}
                {this.state.guessedWordModal && (
                    <GenericModal
                        title='Guessed word:'
                        content={this.state.guessedWordModal}
                        volumeSettings={this.props.volumeSettings}
                        onClose={() => {
                            this.setState({ guessedWordModal: null })
                        }}
                    />
                )}
                {this.state.isTieModal && (
                    <GenericModal
                        title='TIE.'
                        content='Turn is tied. None of the players won.'
                        volumeSettings={this.props.volumeSettings}
                        onClose={() => {
                            this.setState({ isTieModal: null })
                        }}
                    />
                )}
                {this.state.gameEndWinnerModal && (
                    <GenericModal
                        title='GAME ENDED.'
                        content={`Player ${
                            this.state.gameEndWinnerModal
                        } has won the game.`}
                        volumeSettings={this.props.volumeSettings}
                        onClose={() => {
                            this.setState({ gameEndWinnerModal: null })
                            this.props.history.push('/browser')
                            this.setState({ game: null })
                        }}
                    />
                )}
                <ReactAudioPlayer
                    volume={this.props.volumeSettings.soundVol}
                    src={this.state.soundSrc}
                    autoPlay
                    onEnded={() => {
                        this.setState({ soundSrc: '' })
                    }}
                />
                <Cards
                    cards={cards.my}
                    areMyCards={true}
                    onCardUse={this.onCardUse}
                    onDiscard={this.onDiscard}
                    onUseAbort={this.onUseAbort}
                    isDiscardEnabled={this.state.isDiscardEnabled}
                    isMove={this.props.isMove}
                    game={this.state.game}
                    player={this.props.player}
                    cardMoves={this.state.cardMoves}
                />
                <Content
                    player={this.props.player}
                    onMoveTimeout={this.onMoveTimeout}
                    isMove={this.props.isMove}
                    game={this.state.game}
                    keyMove={this.state.keyMove}
                    onKeyMove={this.onKeyMove}
                    onEndTurn={this.onMove}
                />
                <Cards
                    cards={cards.enemy}
                    areMyCards={false}
                    isMove={this.props.isMove}
                    game={this.state.game}
                    player={this.props.player}
                />
            </div>
        )
    }
}

Game.propTypes = {
    game: PropTypes.object,
    socket: PropTypes.object,
    player: PropTypes.object,
    history: PropTypes.object.isRequired,
    isMove: PropTypes.bool.isRequired,
    muteMusic: PropTypes.func.isRequired,
    setMove: PropTypes.func.isRequired,
    setTitle: PropTypes.func.isRequired,
    volumeSettings: PropTypes.object.isRequired
}

export default withRouter(Game)
