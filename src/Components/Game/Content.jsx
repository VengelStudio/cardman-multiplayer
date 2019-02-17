import React, { Component } from 'react'
import Keyboard from './Keyboard'
import Timer from './Timer'
import { Droppable } from 'react-drag-and-drop'
import './Content.css'

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

    colorDisplayWord = word => {
        word = word.toUpperCase()
        let result = []
        let guessed = this.props.game.guessed
        let key = 0
        Array.from(word).forEach(letter => {
            let newLetter = null
            if (letter === '_') {
                newLetter = <span key={key}>{letter}</span>
            } else if (letter === ' ') {
                newLetter = <span key={key}>{letter}</span>
            } else {
                let guessedKeyData = guessed.filter(g => {
                    return g.key === letter
                })[0]
                let guessedKeyByMe =
                    guessedKeyData.playerSocketId === this.props.player.socketId
                if (guessedKeyByMe) {
                    newLetter = (
                        <span key={key} style={{ color: '#0900ff' }}>
                            {letter}
                        </span>
                    )
                } else {
                    newLetter = (
                        <span key={key} style={{ color: '#b92e34' }}>
                            {letter}
                        </span>
                    )
                }
            }
            result.push(newLetter)
            key = key + 1
        })
        return result
    }

    onDrop(data) {
        console.log(data)
    }

    render() {
        let displayWord = []
        if (this.state.game !== null) {
            displayWord = this.colorDisplayWord(this.state.game.displayWord)
        }

        let isHighlight = this.props.isCardTargetHighlight
        let highlightStyle = isHighlight
            ? { boxShadow: '0px 0px 66px 19px rgba(247,217,22,1)' }
            : null

        return (
            <div className='content'>
                <div className='timer-wrapper'>
                    {this.props.move && (
                        <Timer time={30} onEnd={this.props.onMoveTimeout} />
                    )}
                </div>
                <div className='game'>
                    <Droppable types={['card']} onDrop={this.onDrop}>
                        <div
                            style={highlightStyle}
                            className='word border-neon border-neon-violet'
                        >
                            {displayWord.map(x => {
                                return x
                            })}
                        </div>
                    </Droppable>
                    {this.state.game && (
                        <Keyboard
                            player={this.props.player}
                            moveHandler={this.props.moveHandler}
                            guessed={this.props.game.guessed}
                        />
                    )}
                </div>
            </div>
        )
    }
}

export default Content
