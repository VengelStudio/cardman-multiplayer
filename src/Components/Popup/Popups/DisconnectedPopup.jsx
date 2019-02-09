import React, { Component } from 'react'
import '../Popup.css'

class DisconnectedPopup extends Component {
    render() {
        return (
            <div className='generic-popup border-neon border-neon-red text-nunito'>
                <div className='disconnected-popup-content'>
                    <div className='msg'>
                        You have been disconnected from the server.
                    </div>
                    <div className='spinner-wrapper'>
                        <span className='fa fa-spinner fa-spin fa-3x' />
                    </div>
                    <div className='msg'>Trying to reconnect...</div>
                </div>
            </div>
        )
    }
}

export default DisconnectedPopup
