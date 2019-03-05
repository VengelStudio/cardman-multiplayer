import React from 'react'
import { Icon } from 'react-icons-kit'
import { cross } from 'react-icons-kit/icomoon/cross'

const ConfirmationPopup = props => {
    const onClose = () => {
        props.popupData.onConfirm()
        props.popupData.onClose(props.popupData.id)
    }

    return (
        <div className='generic-popup border-neon border-neon-red text-nunito bg-khaki'>
            <div className='generic-popup-title'>
                <span>{props.popupData.title}</span>
                <button onClick={onClose} className='btn-popup-close'>
                    <Icon icon={cross} size='1.6vh' className='close-icon' />
                </button>
            </div>
            <div className='generic-popup-content'>
                <div>{props.popupData.content}</div>
                <div className='popup-buttons'>
                    <button
                        className='border-neon border-neon-lime'
                        onClick={() => {
                            onClose()
                        }}
                    >
                        <span>OK</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationPopup
