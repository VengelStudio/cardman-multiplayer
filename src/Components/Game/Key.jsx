import React, { Component } from 'react'

class Key extends Component {
    render() {
        let { isUsed, isSelected, letter, keyClickHandler } = this.props
        let style = { backgroundColor: '#519C3F' }
        if (isUsed) style = { backgroundColor: '#555', textDecoration: 'none' }
        if (isSelected)
            style = {
                ...style,
                borderWidth: '0.3vh',
                borderStyle: 'solid',
                borderColor: 'orange'
            }
        return (
            <button
                style={style}
                onClick={() => {
                    keyClickHandler()
                }}
                className='key'
            >
                {letter}
            </button>
        )
    }
}

export default Key
