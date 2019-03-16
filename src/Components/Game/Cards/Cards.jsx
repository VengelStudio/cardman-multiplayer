import React, { Component } from 'react'
import Card from './Card'
import './Cards.css'
const { Cards: CardsData } = require('../../../Game/Cards/Cards')

const CardsSpawner = props => {
    let {
        cards,
        areMyCards,
        isDiscardEnabled,
        player,
        game,
        cardMoves,
        isMove,
        onDiscard,
        onUseAbort,
        onCardUse
    } = props
    let blockCounter = 0
    if (game !== null) blockCounter = game.blockCounters[player.socketId]
    let resultCards = null
    if (cards !== null) {
        resultCards = cards.map((card, index) => {
            let cardData = CardsData[card.id]

            let cardBehaviour = {
                isMine: false
            }
            if (areMyCards) {
                //todo cardMoves
                let isUsed = cardMoves.some(move => {
                    return move.discarded === false && move.index === index
                })
                let data = { cardId: card.id, index }
                let isBlocked = false
                if (blockCounter > 0 && blockCounter <= 2) {
                    isBlocked = true
                }

                cardBehaviour = {
                    isMine: true,
                    isUsed,
                    isDiscardEnabled,
                    isBlocked,
                    isDisabled: !cardData.doesMeetConditions(game, player)
                }

                return (
                    <li key={index}>
                        <Card
                            index={index}
                            card={card}
                            cardBehaviour={cardBehaviour}
                            onUse={() => {
                                isMove && onCardUse(data)
                            }}
                            onUseAbort={() => {
                                onUseAbort(index)
                            }}
                            onDiscard={() => {
                                isMove && onDiscard(index, card.id)
                            }}
                        />
                    </li>
                )
            } else {
                return (
                    <li key={index}>
                        <Card card={card} cardBehaviour={cardBehaviour} />
                    </li>
                )
            }
        })
    }
    return <ul>{resultCards}</ul>
}

class Cards extends Component {
    state = { isTooltipOpenable: this.props.areMine }

    onUse = data => {
        if (this.props.areMyCards) this.props.onCardUse(data)
    }

    render() {
        let { areMyCards, isMove } = this.props

        let cardStyle = null
        if ((areMyCards && isMove) || (!areMyCards && !isMove))
            cardStyle = {
                animation:
                    'moveFlashing 400ms linear infinite alternate-reverse forwards'
            }

        let wrapperTitle = areMyCards ? 'Your cards:' : 'Enemy cards:'

        return (
            <div className='cards' style={cardStyle}>
                <span className='cards-title'>{wrapperTitle}</span>
                <div className='cards-wrapper'>
                    <CardsSpawner {...this.props} />
                </div>
            </div>
        )
    }
}

export default Cards
