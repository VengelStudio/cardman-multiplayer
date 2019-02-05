import React, { Component } from 'react'
import './PlayersBrowser.css'

class BrowserEntry extends Component {
    clickHandler = () => {
        this.props.invitationHandler({
            id: this.props.id,
            socketId: this.props.socketId
        })
    }

    render() {
        return (
            <div className='browser-entry width-full'>
                <span className='player-info'>
                    <span className='nickname'>{this.props.nickname}</span>
                </span>
                <button
                    onClick={e => {
                        this.clickHandler()
                    }}
                    className='play border-neon border-neon-lime'
                >
                    Play
                </button>
            </div>
        )
    }
}

export default BrowserEntry
