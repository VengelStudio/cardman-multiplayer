import React, { Component } from 'react'
import Card from './Card'
import './Cards.css'

import { Draggable } from 'react-drag-and-drop'

class Cards extends Component {
    state = { displayTooltip: this.props.displayTooltip }
    getBg = () => {
        let animationStyle = {
            animationName: 'moveFlashing',
            animationDuration: '400ms',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            animationDirection: 'alternate-reverse',
            animationFillMode: 'forwards'
        }
        return this.props.move ? animationStyle : {}
    }

    CardsSpawner = () => {
        let { cards } = this.props
        if (cards !== null) {
            return cards.map((card, i) => (
                <Draggable
                    key={i}
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
                            key={i}
                            displayTooltip={this.state.displayTooltip}
                        />
                    </li>
                </Draggable>
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
