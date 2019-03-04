import React, { Component } from 'react'
import { Droppable } from 'react-drag-and-drop'
import Keyboard from './Keyboard'
import Timer from './Timer'
import PlayerState from './PlayerState'
import { POPUP_CONFIRMATION } from '../Popup/Types'
import './Content.css'
import cardDropSound from '../../Resources/Sounds/card_drop.mp3'
import flipSound3 from '../../Resources/Sounds/card_flip3.mp3'
import buttonClick from '../../Resources/Sounds/button_click.mp3'
const { Cards: CardsData } = require('../../Game/Cards/Cards')

class Content extends Component {
    state = { keyMove: null, cardMoves: [], clickedIndex: null }

    static getDerivedStateFromProps(props, state) {
        let newCardMoves = state.cardMoves
        Object.keys(props.usedCardIndexes).forEach(index => {
            index = parseInt(index)
            let val = props.usedCardIndexes[index]
            if (val === false) {
                newCardMoves = newCardMoves.filter(move => {
                    return move.index !== index
                })
            }
        })
        return {
            cardMoves: newCardMoves
        }
    }

    setSelectedKey = state => {
        this.props.playSound(buttonClick)
        this.setState({ clickedIndex: state })
    }

    colorDisplayWord = word => {
        word = word.toUpperCase()
        let result = []
        let { guessed } = this.props.game
        let { socketId } = this.props.player
        Array.from(word).forEach((letter, i) => {
            let style = null
            if (letter !== '_' && letter !== ' ') {
                let key = guessed.filter(g => {
                    return g.key === letter
                })[0]
                if (key.playerSocketId === socketId) {
                    style = { color: '#0900ff' }
                } else {
                    style = { color: '#b92e34' }
                }
            }
            result.push(
                <span key={i} style={style}>
                    {letter}
                </span>
            )
        })
        return result
    }

    onDrop = data => {
        if (this.props.move) {
            let card = JSON.parse(data.card)
            let move = {
                index: card.index,
                type: 'card',
                card: card.cardId,
                playerSocketId: this.props.player.socketId
            }

            let { usedCardIndexes } = this.props
            usedCardIndexes[card.index] = true
            this.props.updateUsedCardIndexes(usedCardIndexes)

            let isDuplicate = this.state.cardMoves.some(
                cardMove => cardMove.index === card.index
            )
            if (isDuplicate === false) {
                setTimeout(() => {
                    this.props.playSound(cardDropSound)
                }, 100)
                this.setState({ cardMoves: [...this.state.cardMoves, move] })
            }
        }
    }

    onMove = ({ move }) => {
        if (this.props.move) {
            this.setState({ keyMove: move })
        }
    }

    onEndTurn = () => {
        if (this.state.keyMove !== null || this.state.cardMoves.length > 0) {
            if (this.props.move) {
                let moves = []
                let { keyMove, cardMoves } = this.state
                if (keyMove !== null) moves.push(keyMove)
                if (cardMoves !== []) moves = [...moves, ...cardMoves]
                this.props.moveHandler({ moves })
                this.setSelectedKey(null)
                this.props.updateUsedCardIndexes({
                    0: false,
                    1: false,
                    2: false
                })
                this.setState({
                    keyMove: null,
                    cardMoves: []
                })
                this.props.playSound(flipSound3)
                cardMoves.forEach(e => {
                    if (e.card === CardsData.DEFINITION_CARD.id) {
                        let definitions = this.props.game.word.definitions
                        let randomIndex = Math.floor(
                            Math.random() * definitions.length
                        )

                        this.props.addPopup({
                            popupData: {
                                title: 'Word definition',
                                content: definitions[randomIndex]
                            }
                        })
                    }
                })
            }
        } else {
            this.props.addPopup({
                popupData: {
                    title: 'You need to move',
                    content: "You can't move without making any choice."
                }
            })
        }
    }

    endTurnButton = () => {
        let text = 'Waiting...'
        if (this.props.move) text = 'End turn'
        let classes =
            'end-turn-btn button-pointer border-neon border-light-translucent '
        if (this.props.move) classes += 'end-turn-btn-hover'

        return (
            <button
                onClick={this.onEndTurn}
                disabled={!this.props.move}
                className={classes}
            >
                {text}
            </button>
        )
    }

    getPlayerState = me => {
        let socketId = null
        let { game, player } = this.props
        if (player === null || game === null) return 0
        if (me) {
            return game.blockCounters[player.socketId]
        } else {
            let socketId = game.playerSockets.filter(e => {
                return e.socketId != player.socketId
            })[0].socketId
            return game.blockCounters[socketId]
        }
    }

    render() {
        let displayWord = []
        if (this.props.game !== null) {
            displayWord = this.colorDisplayWord(this.props.game.displayWord)
        }

        let wordClass = 'word border-neon border-neon-violet '
        if (this.props.isCardTargetHighlight && this.props.move)
            wordClass += 'word-glow'

        return (
            <div className='content'>
                <PlayerState me={true} state={this.getPlayerState(true)} />
                <PlayerState me={false} state={this.getPlayerState(false)} />
                <div className='timer-wrapper'>
                    {this.props.move && (
                        <Timer time={30} onEnd={this.props.onMoveTimeout} />
                    )}
                </div>
                <div className='game'>
                    <Droppable types={['card']} onDrop={this.onDrop}>
                        <div className={wordClass}>
                            {displayWord.map(x => {
                                return x
                            })}
                        </div>
                    </Droppable>
                    <div className='keyboard-wrapper'>
                        <this.endTurnButton />
                        {this.props.game && (
                            <Keyboard
                                player={this.props.player}
                                moveHandler={this.onMove}
                                keys={this.props.game.keys}
                                setSelectedKey={this.setSelectedKey}
                                clickedIndex={this.state.clickedIndex}
                            />
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default Content
