import React from 'react'
import ReactDOM from 'react-dom'
import { Icon } from 'react-icons-kit'
import { cross } from 'react-icons-kit/icomoon/cross'

import ReactAudioPlayer from 'react-audio-player'
import popupSound from '../../../Resources/Sounds/popup.mp3'

import '../Popup.css'
const CardModal = props => {
    let { cardId, description, onClose, soundVolume } = props

    return ReactDOM.createPortal(
        <React.Fragment>
            <ReactAudioPlayer volume={soundVolume} src={popupSound} autoPlay />
            <div className='generic-popup border-neon border-neon-red text-nunito'>
                <div className='generic-popup-title'>
                    <span />
                    <button onClick={onClose} className='btn-popup-close'>
                        <Icon
                            icon={cross}
                            size='1.6vh'
                            className='close-icon'
                        />
                    </button>
                </div>
                <div className='lookup-card-wrapper'>
                    <img
                        className='lookup-card-display'
                        src={`images/cards/${cardId}.svg`}
                        alt='Card'
                    />
                    <span>{description}</span>
                </div>
            </div>
        </React.Fragment>,
        document.body
    )
}

export default CardModal
