import React, { Component } from 'react'
import '../Popup.css'

class GenericPopup extends Component {
    onClose = accepted => {
        if (accepted) {
            this.props.popupData.onAccept()
        } else {
            this.props.popupData.onDecline()
        }
        this.props.popupData.onClose(this.props.popupData.id)
    }

    render() {
        return (
            <div className='generic-popup border-neon border-neon-red text-nunito bg-khaki'>
                <div className='generic-popup-title'>
                    <span>New game invitation!</span>
                </div>
                <div className='invitation-popup-content'>
                    <div className='msg'>
                        {`You have been invited by ${
                            this.props.popupData.nickname
                        }.`}
                    </div>
                    <div className='popup-buttons'>
                        <button
                            className='border-neon border-neon-lime'
                            onClick={() => {
                                this.onClose(true)
                            }}
                        >
                            <span>Accept</span>
                        </button>
                        <button
                            className='border-neon border-neon-orange'
                            onClick={() => {
                                this.onClose(false)
                            }}
                        >
                            <span>Decline</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default GenericPopup
