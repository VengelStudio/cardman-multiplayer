import BrowserEntry from './BrowserEntry'
import React from 'react'

export const extractBrowserPlayers = ({
    player,
    connectedPlayers,
    invitationHandler
}) => {
    connectedPlayers = Object.assign({}, connectedPlayers)

    //* don't display the current player
    if (player) {
        delete connectedPlayers[player.nickname]
    }

    let result = []
    Object.values(connectedPlayers).forEach(player => {
        let { isInGame } = player
        if (isInGame === false) {
            result.push(
                <BrowserEntry
                    id={player.id}
                    socketId={player.socketId}
                    invitationHandler={invitationHandler}
                    nickname={player.nickname}
                    key={player.id}
                    index={Object.values(connectedPlayers).indexOf(player)}
                />
            )
        }
    })
    return result
}
