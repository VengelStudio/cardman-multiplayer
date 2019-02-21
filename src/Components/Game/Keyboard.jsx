import React, { Component } from 'react'
import Key from './Key'

class Keyboard extends Component {
    state = { clickedIndex: null }

    generateKeys = () => {
        let result = []
        for (let i = 65; i <= 90; i++) {
            let letter = String.fromCharCode(i).toUpperCase()
            let isUsed = false
            let guessedKeys = []
            let guessed = this.props.guessed

            for (let j = 0; j < guessed.length; j++) {
                guessedKeys.push(guessed[j].key)
            }
            if (guessedKeys.includes(letter)) {
                isUsed = true
            }

            let isClicked = this.props.clickedIndex === i
            let onClick = index => {
                if (this.props.clickedIndex === index) {
                    this.props.setSelectedKey(null)
                } else {
                    this.props.setSelectedKey(index)
                }
            }
            result.push(
                <Key
                    moveHandler={this.props.moveHandler}
                    onClick={() => onClick(i)}
                    key={i}
                    player={this.props.player}
                    letter={letter}
                    isUsed={isUsed}
                    isClicked={isClicked}
                />
            )
        }
        return result
    }

    render() {
        return (
            <div className='keyboard border-neon border-light-translucent'>
                {this.generateKeys().map(key => {
                    return key
                })}
            </div>
        )
    }
}

export default Keyboard
