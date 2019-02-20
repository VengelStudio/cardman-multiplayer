import React, { Component } from 'react'
import Keyboard from './Keyboard'
import Timer from './Timer'
import { Droppable } from 'react-drag-and-drop'
import './Content.css'

class Content extends Component {
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
        this.props.moveHandler({
            move: {
                type: 'card',
                card: data,
                playerSocketId: this.props.player.socketId
            }
        })
    }

    render() {
        let displayWord = []
        if (this.props.game !== null) {
            displayWord = this.colorDisplayWord(this.props.game.displayWord)
        }

        let wordClass = 'word border-neon border-neon-violet '
        if (this.props.isCardTargetHighlight) wordClass += 'word-glow'

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
                    {this.props.game && (
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
