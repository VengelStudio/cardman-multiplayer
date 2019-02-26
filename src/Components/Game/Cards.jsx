import React, { Component } from 'react'
import Card from './Card'
import './Cards.css'

import { Draggable } from 'react-drag-and-drop'

import flipSound1 from '../../Resources/Sounds/card_flip.mp3'
import flipSound2 from '../../Resources/Sounds/card_flip2.mp3'

class Cards extends Component {
    state = { displayTooltip: this.props.areMine }

    getBg = () => {
        if (this.props.move) {
            return {
                animationName: 'moveFlashing',
                animationDuration: '400ms',
                animationIterationCount: 'infinite',
                animationTimingFunction: 'linear',
                animationDirection: 'alternate-reverse',
                animationFillMode: 'forwards'
            }
        }
        return null
    }

    GenerateCard = ({ card, isMine, index }) => {
        if (isMine) {
            let isUsed = this.props.usedCardIndexes[index]
            let data = JSON.stringify({ cardId: card.id, index })
            return (
                <Draggable
                    enabled={isMine && !isUsed}
                    onDragStart={() => {
                        this.setState({ displayTooltip: false })
                        this.props.playSound(flipSound1)
                        this.props.setCardTargetHighlight(true)
                    }}
                    onDragEnd={() => {
                        this.setState({ displayTooltip: true })
                        this.props.playSound(flipSound2)
                        this.props.setCardTargetHighlight(false)
                    }}
                    type='card'
                    data={data}
                >
                    <li>
                        <Card
                            index={index}
                            card={card}
                            displayTooltip={this.state.displayTooltip}
                            isMine={isMine}
                            isUsed={isUsed}
                            onUseAbort={() => {
                                this.props.onUseAbort(index)
                            }}
                        />
                    </li>
                </Draggable>
            )
        } else {
            return (
                <li>
                    <Card
                        card={card}
                        displayTooltip={this.state.displayTooltip}
                        isMine={isMine}
                    />
                </li>
            )
        }
    }

    CardsSpawner = () => {
        let { cards } = this.props
        if (cards !== null) {
            return cards.map((card, i) => (
                <this.GenerateCard
                    card={card}
                    index={i}
                    key={i}
                    isMine={this.props.areMine}
                />
            ))
        } else {
            return null
        }
    }

    render() {
        return (
            <div className='cards' style={this.getBg()}>
                <span className='cards-title'>
                    {this.props.title && this.props.title}
                </span>
                <div className='cards-wrapper'>
                    <ul>
                        <this.CardsSpawner />
                    </ul>
                </div>
            </div>
        )
    }
}

export default Cards
