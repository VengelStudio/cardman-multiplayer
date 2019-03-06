import React, { Component } from 'react'
import { WALKTHROUGH_READY } from '../../Shared/Events'
import './Walkthrough.css'
// import image from '../../../public/images/walkthrough/walkthrough.png'

const Description = () => {
    return (
        <React.Fragment>
            <ol>
                <li>
                    <span>Your cards which you can use during a turn.</span>
                </li>
                <li>
                    <span>
                        Keyboard where you can guess a letter by clicking it and
                        end turn.
                    </span>
                </li>
                <li>
                    <span>
                        Place for a random word. Your guessed letters are
                        colored by blue and opponent's are red.
                    </span>
                </li>
            </ol>
            <ul>
                <li>
                    <span>
                        During a turn you can use cards and guess one letter.
                    </span>
                </li>
                <li>
                    <span>
                        To use a card drag it on the random word (number 3) and
                        drop.
                    </span>
                </li>
                <li>
                    <span>
                        Game ends after you or your opponent win two rounds.
                    </span>
                </li>
            </ul>
        </React.Fragment>
    )
}

class Walkthrough extends Component {
    state = { buttonVisibility: true }

    onReady = () => {
        const { socket } = this.props
        socket.emit(WALKTHROUGH_READY, { gameId: this.props.gameId })
        this.setState({ buttonVisibility: false })
    }

    componentDidMount() {
        this.props.setTitle({ title: 'Walkthrough' })
    }

    render() {
        let buttonClass = this.state.buttonVisibility
            ? 'ok-btn border-neon border-neon-orange'
            : 'ok-btn-pressed ok-btn border-neon border-neon-orange'
        let content = this.state.buttonVisibility
            ? 'READY'
            : 'Waiting for opponent...'
        return (
            <div className='gameWrapper'>
                <div className='walkthrough'>
                    <img
                        className='walkthrough-image'
                        src='images/walkthrough/walkthrough.png'
                        alt='Walkthrough screenshot'
                    />
                    <Description />
                    <div className='ok-btn-wrapper'>
                        <button className={buttonClass} onClick={this.onReady}>
                            {content}
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Walkthrough
