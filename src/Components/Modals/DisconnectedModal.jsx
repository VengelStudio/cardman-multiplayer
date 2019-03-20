import React from 'react'
import ReactDOM from 'react-dom'

import ReactAudioPlayer from 'react-audio-player'
import popupSound from '../../Resources/Sounds/popup.mp3'

import './Popup.css'
const DisconnectedPopup = props => {
    let { soundVolume } = props
    return ReactDOM.createPortal(
        <React.Fragment>
            <ReactAudioPlayer volume={soundVolume} src={popupSound} autoPlay />
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
        </React.Fragment>,
        document.body
    )
}

export default DisconnectedPopup
