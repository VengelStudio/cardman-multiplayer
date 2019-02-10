import React from 'react'

const InvitationPopup = props => {
    const onClose = accepted => {
        if (accepted) {
            props.popupData.onAccept()
        } else {
            props.popupData.onDecline()
        }
        props.popupData.onClose(props.popupData.id)
    }

    const message = `You have been invited by ${props.popupData.nickname}.`

    return (
        <div className='generic-popup border-neon border-neon-red text-nunito bg-khaki'>
            <div className='generic-popup-title'>
                <span>New game invitation!</span>
            </div>
            <div className='invitation-popup-content'>
                <div className='msg'>{message}</div>
                <div className='popup-buttons'>
                    <button
                        className='border-neon border-neon-lime'
                        onClick={() => {
                            onClose(true)
                        }}
                    >
                        <span>Accept</span>
                    </button>
                    <button
                        className='border-neon border-neon-orange'
                        onClick={() => {
                            onClose(false)
                        }}
                    >
                        <span>Decline</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InvitationPopup
