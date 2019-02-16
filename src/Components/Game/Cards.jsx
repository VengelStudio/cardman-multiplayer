import React, { Component } from 'react'
import { List, arrayMove } from 'react-movable'
import Card from './Card'
import './Cards.css'

class Cards extends Component {
    state = {
        cards: null
    }

    static getDerivedStateFromProps(props, state) {
        if (props.cards !== state.cards) {
            return {
                cards: props.cards
            }
        }
        return null
    }

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

    getTypeCss = () => {
        switch (this.props.type) {
            case 1:
                return 'child-border-neon-blue'
            case -1:
                return 'child-border-neon-red'
            default:
                return 'child-border-neon-violet'
        }
    }

    CardsSpawner = () => {
        let cards = this.state.cards
        let draggedStyle = {
            color: '#fff',
            fontFamily: 'Nunito, sans-serif',
            textAlign: 'center'
        }
        if (cards !== null) {
            return (
                <List
                    values={cards}
                    onChange={({ oldIndex, newIndex }) =>
                        this.setState(prevState => ({
                            cards: arrayMove(
                                prevState.cards,
                                oldIndex,
                                newIndex
                            )
                        }))
                    }
                    renderList={({ children, props }) => (
                        <ul {...props}>{children}</ul>
                    )}
                    renderItem={({ value, props }) => (
                        <li
                            {...Object.assign(props, {
                                style: { ...props.style, ...draggedStyle }
                            })}
                        >
                            <Card {...value} />
                        </li>
                    )}
                />
            )
        } else {
            return null
        }
    }

    render() {
        return (
            <div className='cards' style={this.getBg()}>
                <span className='cards-title'>
                    {this.props.title ? this.props.title : ''}
                </span>
                <div className={`cards-wrapper ${this.getTypeCss()}`}>
                    <this.CardsSpawner />
                </div>
            </div>
        )
    }
}

export default Cards
