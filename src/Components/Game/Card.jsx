import React, { Component } from 'react'
import ReactAudioPlayer from 'react-audio-player'
import flipSound1 from '../../Resources/Sounds/card_flip.mp3'
import flipSound2 from '../../Resources/Sounds/card_flip2.mp3'
import flipSound3 from '../../Resources/Sounds/card_flip3.mp3'
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
    state = { playFlipSound: false }

    getRandomFlipSound = () => {
        let i = Math.floor(Math.random() * 2)
        switch (i) {
            case 2:
                return flipSound3
            case 1:
                return flipSound2
            default:
                return flipSound1
        }
    }

    FlipSound = () => {
        return (
            <ReactAudioPlayer
                volume={this.props.soundVolume}
                src={flipSound1}
                autoPlay
                onended={() => {
                    this.setState({ playFlipSound: false })
                }}
            />
        )
    }

    cardClasses = () => {
        let classes = 'card '
        if (this.props.isMine) classes += 'hover-pointer'
        return classes
    }

    render() {
        return (
            <div className={this.cardClasses()}>
                {this.state.playFlipSound && <this.FlipSound />}
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
