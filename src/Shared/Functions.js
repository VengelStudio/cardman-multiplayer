const isMove = ({ game, player }) => {
    let nextPlayerIndex = game.nextPlayerIndex
    return game.playerSockets[nextPlayerIndex].id === player.id
}

module.exports = { isMove }
