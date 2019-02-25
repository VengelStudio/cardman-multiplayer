import React, { Component } from 'react'
import './Cards.css'

const CardImage = ({ id, isMine, isUsed }) => {
    let classes = 'card-image '
    if (isUsed) classes += 'card-image-used '

    if (isMine) {
        return (
            <img
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

const CardDescription = ({ text, displayTooltip }) => {
    if (displayTooltip) {
        return <div className='card-info'>{text}</div>
    }
    return null
}

const CardUseAbort = ({ isUsed, onClick }) => {
    if (isUsed) {
        return (
            <button className='card-use-abort-button' onClick={onClick}>
                <div>
                    <span>Click to abort</span>
                </div>
            </button>
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
                    isMine={this.props.isMine}
                    isUsed={this.props.isUsed}
                />
                <CardUseAbort
                    isUsed={this.props.isUsed}
                    onClick={() => {
                        this.props.onUseAbort()
                    }}
                />
                <CardDescription
                    text={this.props.card.description}
                    displayTooltip={this.props.displayTooltip}
                />
            </div>
        )
    }
}

export default Card
