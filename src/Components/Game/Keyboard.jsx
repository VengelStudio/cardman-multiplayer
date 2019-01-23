import React, { Component } from 'react'

class Key extends Component {
    state = {
        clicked: this.props.clicked
    }

    static getDerivedStateFromProps(props, state) {
        if (props.clicked !== state.clicked) {
            return {
                clicked: props.clicked
            }
        }
        return null
    }

    clickHandler = () => {
        console.log(this.props.player)
        this.props.moveHandler({
            move: {
                type: 'key',
                key: this.props.letter,
                playerSocketId: this.props.player.socketId
            }
        })
    }

    render() {
        return (
            <button
                style={
                    this.state.clicked
                        ? { backgroundColor: '#555', textDecoration: 'none' }
                        : {
                            backgroundColor: '#519C3F'
                        }
                }
                onClick={this.clickHandler}
                className='key'
            >
                {this.props.letter}
            </button>
        )
    }
}

class Keyboard extends Component {
    constructor(props) {
        super(props)
        this.state = { guessed: this.props.guessed }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.guessed !== state.guessed) {
            return {
                guessed: props.guessed
            }
        }
        return null
    }

    generateKeys = () => {
        let result = []
        for (let i = 65; i <= 90; i++) {
            let letter = String.fromCharCode(i).toUpperCase()
            let clicked = false
            let guessedKeys = []
            let guessed = this.props.guessed

            for (let j = 0; j < guessed.length; j++) {
                guessedKeys.push(guessed[j].key)
            }
            if (guessedKeys.includes(letter)) {
                clicked = true
            }

            result.push(
                <Key
                    moveHandler={this.props.moveHandler}
                    key={i}
                    player={this.props.player}
                    letter={letter}
                    clicked={clicked}
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
