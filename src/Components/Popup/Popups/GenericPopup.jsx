import React from 'react'
import { Icon } from 'react-icons-kit'
import { cross } from 'react-icons-kit/icomoon/cross'

const GenericPopup = props => {
    const onClose = () => {
        props.popupData.onClose(props.popupData.id)
    }
    console.log(props.popupData.content)

    return (
        <div className='generic-popup border-neon border-neon-red text-nunito'>
            <div className='generic-popup-title'>
                <span>{props.popupData.title}</span>
                <button onClick={onClose} className='btn-popup-close'>
                    <Icon icon={cross} size='1.6vh' className='close-icon' />
                </button>
            </div>
            <div
                className='generic-popup-content'
                dangerouslySetInnerHTML={{
                    __html: props.popupData.content
                }}
            />
        </div>
    )
}

export default GenericPopup
