import React from 'react'
import { Icon } from 'react-icons-kit'
import { cross } from 'react-icons-kit/icomoon/cross'
const { Cards: CardsData } = require('../../../Game/Cards/Cards')

const CardPopup = props => {
    const onClose = () => {
        props.popupData.onClose(props.popupData.id)
    }

    return (
        <div className='generic-popup border-neon border-neon-red text-nunito'>
            <div className='generic-popup-title'>
                <span />
                <button onClick={onClose} className='btn-popup-close'>
                    <Icon icon={cross} size='1.6vh' className='close-icon' />
                </button>
            </div>
            <div className='lookup-card-wrapper'>
                <img
                    className='lookup-card-display'
                    src={`images/cards/${props.popupData.cardId}.svg`}
                    alt='Card image'
                />
                <span
                    dangerouslySetInnerHTML={{
                        __html: props.popupData.description
                    }}
                />
            </div>
        </div>
    )
}

export default CardPopup
