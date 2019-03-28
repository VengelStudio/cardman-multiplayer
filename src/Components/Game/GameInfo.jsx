import React, { Component } from 'react'

const Chains = props => {
    let getSide = props.side
    return (
        <div className={'state-chains ' + getSide}>
            <span>{`Cards blocked for ${props.state} turns.`}</span>
        </div>
    )
}

const Shield = props => {
    let getSide = props.side
    let state = props.state * -1
    return (
        <div className={'state-shield ' + getSide}>
            <span>{`Immune to block cards for ${state} turns.`}</span>
        </div>
    )
}

class GameInfo extends Component {
    getIcon = (state, side) => {
        if (state > 0) return <Chains state={state} side={side} />
        else if (state < 0) return <Shield state={state} side={side} />
        else return null
    }

    getPlayerState = me => {
        let { game, player } = this.props
        if (player === null || game === null) return null
        if (me) {
            return this.getIcon(game.blockCounters[player.socketId], 'left-1vh')
        } else {
            let socketId = game.playerSockets.filter(e => {
                return e.socketId !== player.socketId
            })[0].socketId
            return this.getIcon(game.blockCounters[socketId], 'right-1vh')
        }
    }

    getGuessedCounter = () => {
        let { game, player } = this.props
        let counter = 0

        if (player !== null && game !== null) {
            let { socketId } = player
            let myGuessed = game.guessed.filter(e => {
                return e.playerSocketId === socketId && e.key !== ''
            })
            console.log(myGuessed)
            myGuessed.forEach(letter => {
                if (game.word.word.includes(letter.key.toLowerCase())) counter++
            })
        }
        return counter
    }

    render() {
        return (
            <React.Fragment>
                <div className='player-state'>
                    {this.getPlayerState(true)}
                    {this.getPlayerState(false)}
                </div>
                <div style={{ fontSize: '4vh', position: 'absolute' }}>
                    <p>{`Guessed letters: ${this.getGuessedCounter()}`}</p>
                </div>
            </React.Fragment>
        )
    }
}

export default GameInfo
