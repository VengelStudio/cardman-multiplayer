import React, { Component } from 'react'

class Key extends Component {
    clickHandler = () => {
        this.props.onClick()
        if (this.props.isClicked === false) {
            this.props.moveHandler({
                move: {
                    type: 'key',
                    key: this.props.letter,
                    playerSocketId: this.props.player.socketId
                }
            })
        }
    }

    getStyle = () => {
        let style = null
        style = { backgroundColor: '#519C3F' }
        if (this.props.isUsed) {
            style = { backgroundColor: '#555', textDecoration: 'none' }
        }
        if (this.props.isClicked) {
            style = {
                ...style,
                borderWidth: '0.3vh',
                borderStyle: 'solid',
                borderColor: 'orange'
            }
        }

        return style
    }

    render() {
        return (
            <button
                style={this.getStyle()}
                onClick={this.clickHandler}
                className='key'
            >
                {this.props.letter}
            </button>
        )
    }
}

export default Key
