import React, { Component } from 'react'
import Keyboard from './Keyboard'
import Timer from './Timer'
import { Droppable } from 'react-drag-and-drop'
import './Content.css'

class Content extends Component {
    state = { keyMove: null, cardMoves: [] }

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
        if (this.props.move) {
            let moves = []
            let { keyMove, cardMoves } = this.state
            if (keyMove !== null) moves.push(keyMove)
            if (cardMoves !== []) moves = [...moves, ...cardMoves]
            //todo SEND TO SERVER
            this.props.updateUsedCardIndexes({ 0: false, 1: false, 2: false })
            this.setState({ keyMove: null, cardMoves: [] })
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
                                guessed={this.props.game.guessed}
                            />
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default Content
