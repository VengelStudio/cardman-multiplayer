import React, { Component } from 'react'

const Chains = props => {
    return (
        <div className='state-chains'>
            <span>{`You are blocked for ${props.state} turns.`}</span>
        </div>
    )
}

const Shield = props => {
    return (
        <div className='state-shield'>
            <span>{`Immune to block for ${props.state} turns.`}</span>
        </div>
    )
}

class PlayerState extends Component {
    getState = () => {
        let { state } = this.props
        if (state > 0) return <Chains state={state} />
        else if (state < 0) return <Shield state={state} />
        else return null
    }

    render() {
        return <React.Fragment>{this.getState()}</React.Fragment>
    }
}

export default PlayerState
