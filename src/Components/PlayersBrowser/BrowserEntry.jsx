import React, { Component } from 'react'
import './PlayersBrowser.css'

class BrowserEntry extends Component {
    constructor(props) {
        super(props)
        this.classes = 'browser-entry width-full '
        console.log(this.props.index)
        if (this.props.index % 2 === 0) {
            this.classes += 'browser-entry-lightbg'
        } else {
            this.classes += 'browser-entry-darkbg'
        }
    }

    clickHandler = () => {
        this.props.invitationHandler({
            id: this.props.id,
            socketId: this.props.socketId
        })
    }

    render() {
        return (
            <div className={this.classes}>
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
