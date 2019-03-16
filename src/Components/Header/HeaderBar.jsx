import React from 'react'

const HeaderBar = ({ title = null, score = null }) => {
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
            {title && <div className='title has-text-white-ter'>{title}</div>}
        </div>
    )
}

export default HeaderBar
