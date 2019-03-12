import React, { Component } from 'react'
import { Droppable } from 'react-drag-and-drop'
import Keyboard from './Keyboard'
import Timer from './Timer'
import PlayerState from './PlayerState'
import './Content.css'
import cardDropSound from '../../Resources/Sounds/card_drop.mp3'
import flipSound3 from '../../Resources/Sounds/card_flip3.mp3'
import buttonClick from '../../Resources/Sounds/button_click.mp3'
import GenericModal from '../Popup/Popups/GenericModal'
import CardModal from '../Popup/Popups/CardModal'
const { Cards: CardsData } = require('../../Game/Cards/Cards')

const EndTurnButton = props => {
    let { move, onClick } = props
    let text = 'Waiting...'
    let classes =
        'end-turn-btn button-pointer border-neon border-light-translucent '
    if (move) {
        if (move) classes += 'end-turn-btn-hover'
        text = 'End turn'
    }

    return (
        <button onClick={onClick} disabled={!move} className={classes}>
            {text}
        </button>
    )
}

class Content extends Component {
    state = {
        keyMove: null,
        cardMoves: [],
        clickedIndex: null,
        isDiscardEnabled: false,
        isWordDefinitionModal: false,
        wordDefinition: null,
        isMoveModal: false,
        isPeekModal: false,
        peekCardId: null,
        peekDescription: null
    }

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

    clearKeyMove = () => {
        this.setState({
            keyMove: null,
            clickedIndex: null
        })
    }

    onEndTurn = () => {
        if (this.state.keyMove !== null || this.state.cardMoves.length > 0) {
            if (this.props.move) {
                let moves = []
                let { keyMove, cardMoves } = this.state
                if (keyMove !== null) moves.push(keyMove)
                if (cardMoves !== []) moves = [...moves, ...cardMoves]
                moves = moves.map(move => {
                    return { ...move, discarded: false }
                })
                this.props.moveHandler({ moves })
                this.setSelectedKey(null)
                this.props.updateUsedCardIndexes({
                    0: false,
                    1: false,
                    2: false
                })
                this.setState({
                    keyMove: null,
                    cardMoves: [],
                    clickedIndex: null
                })
                this.props.playSound(flipSound3)
                cardMoves.forEach(e => {
                    if (e.card === CardsData.DEFINITION_CARD.id) {
                        let definitions = this.props.game.word.definitions
                        let randomIndex = Math.floor(
                            Math.random() * definitions.length
                        )
                        this.setState({
                            isWordDefinitionModal: true,
                            wordDefinition: definitions[randomIndex]
                        })
                    } else if (e.card === CardsData.LOOK_UP_CARD.id) {
                        let enemySocket = this.props.game.playerSockets.filter(
                            x => {
                                return x.socketId !== this.props.player.socketId
                            }
                        )[0].socketId
                        let enemyCards = this.props.game.cards[enemySocket]
                        let randomIndexOfCard = Math.floor(
                            Math.random() * enemyCards.length
                        )
                        let randomEnemyCard = enemyCards[randomIndexOfCard].id
                        let { description } = CardsData[randomEnemyCard]
                        this.setState({
                            isPeekModal: true,
                            peekCardId: enemyCards[randomIndexOfCard].id,
                            peekDescription: description
                        })
                    }
                })
            }
        } else {
            this.setState({
                isMoveModal: true
            })
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

        let {
            isWordDefinitionModal,
            wordDefinition,
            isMoveModal,
            isPeekModal,
            peekCardId,
            peekDescription,
            clickedIndex
        } = this.state

        let { onMoveTimeout, move, game, player, volumeSettings } = this.props
        return (
            <div className='content'>
                {isWordDefinitionModal && (
                    <GenericModal
                        title='Word definition:'
                        content={wordDefinition}
                        onClose={() =>
                            this.setState({ isWordDefinitionModal: false })
                        }
                        soundVolume={volumeSettings.soundVol}
                    />
                )}
                {isMoveModal && (
                    <GenericModal
                        title='Cannot continue!'
                        content='You have to make a a move.'
                        onClose={() => this.setState({ isMoveModal: false })}
                        soundVolume={volumeSettings.soundVol}
                    />
                )}
                {isPeekModal && (
                    <CardModal
                        cardId={peekCardId}
                        description={peekDescription}
                        onClose={() => this.setState({ isPeekModal: false })}
                        soundVolume={volumeSettings.soundVol}
                    />
                )}
                <PlayerState player={player} game={game} />
                <div className='timer-wrapper'>
                    {move && <Timer time={30} onEnd={onMoveTimeout} />}
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
                        <EndTurnButton move={move} onClick={this.onEndTurn} />
                        {game && (
                            <Keyboard
                                player={player}
                                moveHandler={this.onMove}
                                keys={game.keys}
                                setSelectedKey={this.setSelectedKey}
                                clickedIndex={clickedIndex}
                                clearKeyMove={this.clearKeyMove}
                            />
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default Content
