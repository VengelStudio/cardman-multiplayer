import React from 'react'

const HeaderBar = ({ title = null, score = null }) => {
    let displayScore = false
    if (score !== null) displayScore = true

    return (
        <div className='column auto has-background-dark header'>
            {score && (
                <div className='title has-text-white-ter'>
                    <div className='scoreHeader'>
                        <div className='flex-item me'>
                            <span>{score.me}</span>
                        </div>
                        <div className='flex-item score'>
                            <span>{`${score.myScore}:${
                                score.enemyScore
                            }`}</span>
                        </div>
                        <div className='flex-item enemy'>
                            <span>{score.enemy}</span>
                        </div>
                    </div>
                </div>
            )}
            {!displayScore && title && (
                <h1 className='title has-text-white-ter'>{title}</h1>
            )}
        </div>
    )
}

export default HeaderBar
