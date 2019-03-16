import React, { Component } from 'react'
import Key from './Key'

class Keyboard extends Component {
    generateKeys = () => {
        let result = []
        for (let i = 65; i <= 90; i++) {
            let letter = String.fromCharCode(i).toUpperCase()
            let myKeys = this.props.keys.filter(
                key => key.playerSocketId === this.props.player.socketId
            )
            myKeys = myKeys.map(key => {
                return key.key
            })

            let isUsed = myKeys.includes(letter)
            let isSelected = false
            if (this.props.keyMove !== null) {
                if (this.props.keyMove.key === letter) {
                    isSelected = true
                }
            }

            let keyClickHandler = () => {
                let move = {
                    type: 'key',
                    key: letter,
                    playerSocketId: this.props.player.socketId
                }
                if (isSelected === false) {
                    this.props.onKeyMove(move)
                } else {
                    this.props.onKeyMove(null)
                }
            }

            result.push(
                <Key
                    key={i}
                    keyClickHandler={keyClickHandler}
                    player={this.props.player}
                    letter={letter}
                    isUsed={isUsed}
                    isSelected={isSelected}
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
