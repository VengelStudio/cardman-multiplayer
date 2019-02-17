import React, { Component } from 'react'
import ReactAudioPlayer from 'react-audio-player'
import flipSound1 from '../../Resources/Sounds/card_flip.mp3'
import flipSound2 from '../../Resources/Sounds/card_flip2.mp3'
import flipSound3 from '../../Resources/Sounds/card_flip3.mp3'

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
                <img
                    className='card-image'
                    src={`images/cards/${this.props.card.id}.svg`}
                    alt='Playing card.'
                />
                {this.props.displayTooltip && (
                    <div className='card-info'>
                        {this.props.card.description}
                    </div>
                )}
            </div>
        )
    }
}

export default Card
