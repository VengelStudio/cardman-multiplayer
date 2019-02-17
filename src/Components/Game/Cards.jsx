import React, { Component } from 'react'
import Card from './Card'
import './Cards.css'

class Cards extends Component {
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
                <Card
                    card={card}
                    key={i}
                    displayTooltip={this.props.displayTooltip}
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
                    <this.CardsSpawner />
                </div>
            </div>
        )
    }
}

export default Cards
