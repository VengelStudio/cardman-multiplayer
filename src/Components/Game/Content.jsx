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
    colorDisplayWord = (word) => {
        let result = []
        let guessed = this.props.game.guessed
        console.log(guessed)
        console.log(word)
        word.forEach(e => {
            if (word !== "_") {
                guessed.forEach(g => {
                    if (e === g.key) {
                        result.push(<span>g.key</span>)
                        return
                    }
                });
            }
        });
        return result
    }

    render() {
        console.log("game: " + this.props.game)
        let displayWord = this.colorDisplayWord(this.state.game.displayWord)
        console.log(displayWord)
        return (
            <div className='content'>
                <div className='game'>
                    <div className='word'>
                        {this.state.game && displayWord.map(x => { return x })}
                    </div>
                    {this.state.game && (
                        <Keyboard
                            player={this.props.player}
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
