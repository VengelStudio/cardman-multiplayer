import React, { Component } from 'react'
import './Cards.css'

const CardImage = ({ id, isMine, isUsed, isDisabled, isBlocked }) => {
    let classes = 'card-image '
    if (isUsed || isDisabled || isBlocked) classes += 'card-image-used '

    if (isMine) {
        return (
            <img
                draggable={!isDisabled}
                onMouseDown={() => {
                    return isDisabled ? false : true
                }}
                className={classes}
                src={`images/cards/${id}.svg`}
                alt='Playing card.'
            />
        )
    } else {
        return (
            <img
                draggable='false'
                onMouseDown={() => {
                    return false
                }}
                style={{ userDrag: 'none' }}
                className={`${classes} default-pointer`}
                src={`images/cards/placeholder.svg`}
                alt='Playing card.'
            />
        )
    }
}

const CardDescription = ({ description, displayTooltip }) => {
    if (displayTooltip) {
        return (
            <div
                className='card-info'
                dangerouslySetInnerHTML={{ __html: description }}
            />
        )
    }
    return null
}

const CardOverlay = ({ isUsed, isDisabled, isBlocked, onClick }) => {
    if (isUsed) {
        return (
            <button className='card-use-abort-button' onClick={onClick}>
                <div>
                    <span>Click to abort</span>
                </div>
            </button>
        )
    } else if (isDisabled) {
        return (
            <div className='card-disabled'>
                <span>
                    This card doesn't meet the conditions. Check the
                    description.
                </span>
            </div>
        )
    } else if (isBlocked) {
        return (
            <div className='card-disabled'>
                <span>This card is disabled.</span>
            </div>
        )
    }
    return null
}

class Card extends Component {
    cardClasses = () => {
        let classes = 'card '
        if (this.props.isMine) classes += 'hover-pointer'
        return classes
    }

    render() {
        return (
            <div className={this.cardClasses()}>
                <CardImage
                    id={this.props.card.id}
                    isDisabled={this.props.isDisabled}
                    isMine={this.props.isMine}
                    isUsed={this.props.isUsed}
                    isBlocked={this.props.isBlocked}
                />
                <CardOverlay
                    isDisabled={this.props.isDisabled}
                    isUsed={this.props.isUsed}
                    isBlocked={this.props.isBlocked}
                    onClick={() => {
                        this.props.onUseAbort()
                    }}
                />
                <CardDescription
                    description={this.props.card.description}
                    displayTooltip={this.props.displayTooltip}
                />
            </div>
        )
    }
}

export default Card
