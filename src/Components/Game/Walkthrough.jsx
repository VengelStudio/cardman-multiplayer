import React, { Component } from 'react'
import { WALKTHROUGH_READY } from '../../Shared/Events'
import './Walkthrough.css'
// import image from '../../../public/images/walkthrough/walkthrough.png'

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
                    <img className='walkthrough-image' src='images/walkthrough/walkthrough.png'></img>
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
