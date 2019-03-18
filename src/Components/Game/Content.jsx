import React, { Component } from 'react'
import Keyboard from './Keyboard'
import Timer from './Timer'
import PlayerState from './PlayerState'
import './Content.css'

const EndTurnButton = props => {
    let { isMove, onClick } = props
    let text = 'Waiting...'
    let classes =
        'end-turn-btn button-pointer border-neon border-light-translucent '
    if (isMove) {
        classes += 'end-turn-btn-hover'
        text = 'End turn'
    } else {
        classes += 'end-turn-btn-waiting '
    }

    return (
        <button onClick={onClick} disabled={!isMove} className={classes}>
            {text}
        </button>
    )
}

class Content extends Component {
    colorDisplayWord = word => {
        word = word.toUpperCase()
        let result = []
        let { guessed } = this.props.game
        let { socketId } = this.props.player
        Array.from(word).forEach((letter, i) => {
            let style = null
            if (letter !== '_' && letter !== ' ') {
                let key = guessed.filter(g => {
                    return g.key === letter
                })[0]
                if (key.playerSocketId === socketId) {
                    style = { color: '#0900ff' }
                } else {
                    style = { color: '#b92e34' }
                }
            }
            result.push(
                <span key={i} style={style}>
                    {letter}
                </span>
            )
        })
        return result
    }

    render() {
        let {
            onMoveTimeout,
            isMove,
            game,
            player,
            onKeyMove,
            keyMove,
            onEndTurn
        } = this.props

        let wordClass = 'word border-neon border-neon-violet '
        return (
            <div className='content'>
                <PlayerState player={player} game={game} />
                <div className='timer-wrapper'>
                    {isMove && <Timer time={300000} onEnd={onMoveTimeout} />}
                </div>
                <div className='game'>
                    <div className={wordClass}>
                        {game &&
                            this.colorDisplayWord(game.displayWord).map(x => {
                                return x
                            })}
                    </div>
                    <EndTurnButton isMove={isMove} onClick={onEndTurn} />
                    <div className='keyboard-wrapper'>
                        {game && (
                            <Keyboard
                                player={player}
                                keys={game.keys}
                                keyMove={keyMove}
                                onKeyMove={onKeyMove}
                            />
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default Content
