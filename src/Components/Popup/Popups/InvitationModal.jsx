import React from 'react'
import ReactDOM from 'react-dom'
import Timer from '../../Game/Timer'

import ReactAudioPlayer from 'react-audio-player'
import popupSound from '../../../Resources/Sounds/popup.mp3'

import '../Popup.css'
const InvitationModal = props => {
    let { nickname, onAccept, onClose, soundVolume } = props

    return ReactDOM.createPortal(
        <React.Fragment>
            <ReactAudioPlayer volume={soundVolume} src={popupSound} autoPlay />
            <div className='generic-popup border-neon border-neon-red text-nunito bg-khaki'>
                <div className='generic-popup-title'>
                    <span>New game invitation!</span>
                </div>
                <div className='invitation-popup-content'>
                    <div className='msg'>{`You have been invited by ${nickname}.`}</div>
                    <Timer time={10} onEnd={onClose} />
                    <div className='popup-buttons'>
                        <button
                            className='border-neon border-neon-lime'
                            onClick={onAccept}
                        >
                            <span>Accept</span>
                        </button>
                        <button
                            className='border-neon border-neon-orange'
                            onClick={onClose}
                        >
                            <span>Decline</span>
                        </button>
                    </div>
                </div>
            </div>
        </React.Fragment>,
        document.body
    )
}

export default InvitationModal
