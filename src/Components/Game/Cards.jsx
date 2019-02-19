import React, { Component } from 'react'
import Card from './Card'
import './Cards.css'

import { Draggable } from 'react-drag-and-drop'

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

    GenerateCard = ({ card, isMine }) => {
        if (isMine) {
            return (
                <Draggable
                    enabled={isMine}
                    onDragStart={() => {
                        this.setState({ displayTooltip: false })
                        this.props.setCardTargetHighlight(true)
                    }}
                    onDragEnd={() => {
                        this.setState({ displayTooltip: true })
                        this.props.setCardTargetHighlight(false)
                    }}
                    type='card'
                    data={card.id}
                >
                    <li>
                        <Card
                            card={card}
                            displayTooltip={this.state.displayTooltip}
                            isMine={isMine}
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
