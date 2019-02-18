import React, { Component } from 'react'
import ReactAudioPlayer from 'react-audio-player'
import flipSound1 from '../../Resources/Sounds/card_flip.mp3'
import flipSound2 from '../../Resources/Sounds/card_flip2.mp3'
import flipSound3 from '../../Resources/Sounds/card_flip3.mp3'

const CardImage = ({ id, isMine }) => {
    if (isMine) {
        return (
            <img
                className='card-image'
                src={`images/cards/${id}.svg`}
                alt='Playing card.'
            />
        )
    } else {
        return (
            <img
                draggable='false'
                onMouseDown={false}
                style={{ userDrag: 'none' }}
                className='card-image'
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

    render() {
        return (
            <div className='card'>
                {this.state.playFlipSound && <this.FlipSound />}
                <CardImage id={this.props.card.id} isMine={this.props.isMine} />
                <CardDescription
                    text={this.props.card.description}
                    displayTooltip={this.props.displayTooltip}
                />
            </div>
        )
    }
}

export default Card
