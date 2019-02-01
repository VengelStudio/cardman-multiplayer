import React, { Component } from 'react'

class Timer extends Component {
    state = { time: this.props.time, style: {} }

    componentDidMount() {
        let timeInterval = setInterval(() => {
            this.setState(prevState => ({ time: prevState.time - 1 }))
            if (this.state.time === 0) {
                clearInterval(timeInterval)
                this.props.onEnd && this.props.onEnd() //execute only if provided
                this.setState({ style: { display: 'none' } })
            }
        }, 1000)
    }

    render() {
        return (
            <div style={this.state.style} className='timer'>
                <div id='timer-number'>{this.state.time}</div>
                <svg className='timer-svg'>
                    <circle r='18' cx='20' cy='20' />
                </svg>
            </div>
        )
    }
}

export default Timer
