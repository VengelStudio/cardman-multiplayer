import React, { Component } from 'react'
import { WALKTHROUGH_READY } from '../../Shared/Events'
import './Walkthrough.css'

const Description = ({ data }) => {
    return (
        <section className='walkthrough-desc'>
            <ul>
                <li>
                    <span>
                        During a turn you can use cards and guess one letter.
                    </span>
                </li>
                <li>
                    <span>To use a card just click it.</span>
                </li>
                <li>
                    <span>
                        Game ends after you or your opponent win two rounds.
                    </span>
                </li>
            </ul>
            <div className='ok-btn-wrapper'>
                <button className={data.buttonClass} onClick={data.onReady}>
                    {data.content}
                </button>
            </div>
        </section>
    )
}

class Walkthrough extends Component {
    state = { isClicked: false }

    onReady = () => {
        const { socket } = this.props
        if (!this.state.isClicked) {
            socket.emit(WALKTHROUGH_READY, { gameId: this.props.gameId })
        }

        this.setState({ isClicked: true })
    }

    componentDidMount() {
        this.props.setTitle({ title: 'Walkthrough' })
    }

    render() {
        let buttonClass = this.state.isClicked
            ? 'ok-btn-pressed ok-btn border-neon border-neon-orange'
            : 'ok-btn border-neon border-neon-orange'
        let content = this.state.isClicked ? 'Waiting for opponent...' : 'READY'
        return (
            <div className='gameWrapper'>
                <div className='walkthrough'>
                    <div className='walkthrough-content'>
                        <img
                            className='walkthrough-image'
                            src='images/walkthrough/Walkthrough.svg'
                            alt='Walkthrough screenshot'
                        />
                        <Description
                            data={{
                                buttonClass,
                                content,
                                onReady: this.onReady
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default Walkthrough
