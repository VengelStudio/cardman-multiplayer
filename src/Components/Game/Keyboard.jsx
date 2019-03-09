import React, { Component } from 'react'
import Key from './Key'

class Keyboard extends Component {
    state = { clickedIndex: null }

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

            let isClicked = this.props.clickedIndex === i

            let onClick = index => {
                if (this.props.clickedIndex === index) {
                    this.props.setSelectedKey(null)
                    this.props.clearKeyMove()
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
