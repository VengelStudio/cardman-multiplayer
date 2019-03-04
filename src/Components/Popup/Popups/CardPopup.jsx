import React from 'react'
import { Icon } from 'react-icons-kit'
import { ic_close } from 'react-icons-kit/md/ic_close'

const CardPopup = props => {
    const onClose = () => {
        props.popupData.onClose(props.popupData.id)
    }

    return (
        <div className='generic-popup border-neon border-neon-red text-nunito'>
            <div className='generic-popup-title'>
                <button onClick={onClose} className='btn-popup-close'>
                    <Icon icon={ic_close} size='28' className='close-icon' />
                </button>
            </div>
            <div>
                <p>{props.content}</p>
            </div>
        </div>
    )
}

export default CardPopup
