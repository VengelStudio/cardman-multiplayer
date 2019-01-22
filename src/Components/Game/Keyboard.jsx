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
        this.props.moveHandler({
            move: { type: 'key', key: this.props.letter }
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
            if (this.props.guessed.includes(letter)) {
                clicked = true
            }

            result.push(
                <Key
                    moveHandler={this.props.moveHandler}
                    key={i}
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
