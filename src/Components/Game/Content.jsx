import React, { Component } from 'react'
import Keyboard from './Keyboard'
import Card from './Cards'

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
        //word = "_ _ _ _ _ _ _ _"
        //guessed = [
        //    {key: "A", socketId: "aasdasdasdasdasdasd"}
        //]
        Array.from(word).forEach(letter => {
            let newLetter = null
            if (letter === '_') {
                newLetter = <span>{letter}</span>
            } else if (letter === ' ') {
                newLetter = <span>{letter}</span>
            } else {
                let guessedKeyData = guessed.filter(g => {
                    return g.key === letter
                })[0]
                let guessedKeyByMe =
                    guessedKeyData.playerSocketId === this.props.player.socketId
                if (guessedKeyByMe) {
                    newLetter = (
                        <span style={{ color: '#0900ff' }}>{letter}</span>
                    )
                } else {
                    newLetter = (
                        <span style={{ color: '#b92e34' }}>{letter}</span>
                    )
                }
            }
            result.push(newLetter)
        })
        return result
    }

    render() {
        let displayWord = []
        if (this.state.game !== null) {
            displayWord = this.colorDisplayWord(this.state.game.displayWord)
        }
        return (
            <div className='content'>
                <div className='game'>
                    <div className='word border-neon border-neon-violet'>
                        {displayWord.map(x => {
                            return x
                        })}
                    </div>
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
