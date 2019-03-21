import React, { Component } from 'react'
import './Cards.css'

const CardContent = ({ id, description, cardBehaviour }) => {
    let {
        isMine,
        isUsed,
        isDisabled,
        isBlocked,
        isDiscardEnabled
    } = cardBehaviour
    let classes = 'card-image '
    if (isUsed || isDisabled || isBlocked || isDiscardEnabled)
        classes += 'card-image-used '

    if (isMine) {
        let descriptionComponent = isUsed ? (
            <div className='card-info'>{description}</div>
        ) : null
        return (
            <React.Fragment>
                <img
                    className={classes}
                    src={`images/cards/${id}.svg`}
                    alt='Playing card.'
                />
                {descriptionComponent}
            </React.Fragment>
        )
    } else {
        return (
            <img
                className={`${classes} default-pointer`}
                src={`images/cards/placeholder.svg`}
                alt='Playing card.'
            />
        )
    }
}

const CardOverlay = ({
    cardBehaviour,
    onUseAbort,
    onDiscard,
    onUse,
    disabledText
}) => {
    let { isUsed, isDisabled, isBlocked, isDiscardEnabled } = cardBehaviour
    let overlay = null
    if (isDiscardEnabled) {
        overlay = (
            <button
                className='card-discard-button'
                onClick={() => {
                    onDiscard()
                }}
            >
                <div>Click to discard</div>
            </button>
        )
    } else if (isUsed) {
        overlay = (
            <button
                className='card-use-abort-button'
                onClick={() => {
                    onUseAbort()
                }}
            >
                <div>Click to abort</div>
            </button>
        )
    } else if (isDisabled) {
        let fontSize = '1.4vw'
        if (disabledText.length > 76) fontSize = '1.2vw'
        overlay = (
            <div className='card-disabled-info' style={{ fontSize }}>
                {disabledText}
            </div>
        )
    } else if (isBlocked) {
        overlay = (
            <div className='card-disabled-info'>Your cards are blocked.</div>
        )
    } else {
        overlay = <button className='card-use-button' onClick={onUse} />
    }
    return <div className='card-overlay'>{overlay}</div>
}

class Card extends Component {
    render() {
        let {
            cardBehaviour,
            card,
            onUseAbort,
            onDiscard,
            onUse,
            isMine
        } = this.props
        let classes = 'card '
        if (isMine) classes += 'hover-pointer'

        return (
            <div className={classes}>
                <CardContent
                    id={card.id}
                    description={card.description}
                    cardBehaviour={cardBehaviour}
                />
                <CardOverlay
                    cardBehaviour={cardBehaviour}
                    onUse={onUse}
                    onUseAbort={onUseAbort}
                    onDiscard={onDiscard}
                    disabledText={card.disabledText}
                />
            </div>
        )
    }
}

export default Card
