import React from 'react'
import { Icon } from 'react-icons-kit'
import { ic_close } from 'react-icons-kit/md/ic_close'

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
                    <Icon icon={ic_close} size='28' className='close-icon' />
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
