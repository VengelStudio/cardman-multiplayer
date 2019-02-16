import React, { Component } from 'react'

class Card extends Component {
    render() {
        return (
            <div className='card'>
                <div className='card-title'>{this.props.title}</div>
                <img
                    className='card-image'
                    src={`images/cards/${this.props.id}.png`}
                    alt='Playing card.'
                />
                {/* <div className='card-info'>{this.props.description}</div> */}
            </div>
        )
    }
}

export default Card
