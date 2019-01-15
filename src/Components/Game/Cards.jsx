import React, { Component } from 'react'
import CardPlaceholder from '../../Resources/Images/img.jpg'

const getBorder = type => {
  let classes = 'card border-neon '
  switch (type) {
    case 1:
      classes += 'border-neon-lime'
      break
    case -1:
      classes += 'border-neon-red'
      break
    default:
      classes += 'border-neon-violet'
      break
  }
  return classes
}

class Card extends Component {
  render() {
    return (
      <div className={getBorder(this.props.type)}>
        <div className='card-title'>Card</div>
        <img
          className='card-image border-neon border-light-translucent'
          src={CardPlaceholder}
          alt='Playing card.'
        />
      </div>
    )
  }
}

class Cards extends Component {
  state = { move: this.props.move }

  static getDerivedStateFromProps(props, state) {
    if (props.move !== state.move) {
      return {
        move: props.move
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
    return this.state.move ? animationStyle : {}
  }

  render() {
    return (
      <div className='cards' style={this.getBg()}>
        <div className='cards-title'>
          {this.props.title ? this.props.title : ''}
        </div>
        <Card type={this.props.type} />
        <Card type={this.props.type} />
        <Card type={this.props.type} />
      </div>
    )
  }
}

export default Cards
