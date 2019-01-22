import React, { Component } from 'react'
import Keyboard from './Keyboard'

class Content extends Component {
    constructor(props) {
        super(props)
        this.state = { game: this.props.game }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.game !== state.game) {
            return {
                game: props.game
            }
        }
        return null
    }

    render() {
        return (
            <div className='content'>
                <div className='game'>
                    <div className='word'>
                        {this.state.game && this.state.game.displayWord}
                    </div>
                    {this.state.game && (
                        <Keyboard
                            moveHandler={this.props.moveHandler}
                            guessed={this.props.game.guessed}
                        />
                    )}
                </div>
                {/* <div className="deck-title">Game deck:</div>
                <div className="deck">
                <Card type={0} />
                <Card type={0} />
                <Card type={0} />
                <Card type={0} />
                <Card type={0} />
            </div> */}
            </div>
        )
    }
}

export default Content
