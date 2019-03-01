import React, { Component } from 'react'

class Timer extends Component {
    timeInterval = null
    state = {
        time: this.props.time,
        wrapperStyle: {},
        circleStyle: {
            animation: `countdown ${this.props.time}s linear 1 forwards`
        },
        propsStyle: null
    }

    componentDidMount() {
        this.timeInterval = setInterval(() => {
            this.setState(
                prevState => ({ time: prevState.time - 1 }),
                () => {
                    if (this.state.time === 0) {
                        clearInterval(this.timeInterval)
                        this.props.onEnd && this.props.onEnd() //execute only if there is a callback provided
                        this.setState({
                            style: { display: 'none', ...this.state.style }
                        })
                    }
                }
            )
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.timeInterval)
    }

    render() {
        return (
            <div style={this.state.wrapperStyle} className='timer'>
                <div id='timer-number'>{this.state.time}</div>
                <svg className='timer-svg'>
                    <circle
                        style={this.state.circleStyle}
                        r='18'
                        cx='20'
                        cy='20'
                    />
                </svg>
            </div>
        )
    }
}

export default Timer
