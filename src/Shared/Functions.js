const isMove = ({ game, player }) => {
    let nextPlayerIndex = game.nextPlayerIndex
    return game.playerSockets[nextPlayerIndex].id === player.id
}

const setScore = ({ player, game = null, setTitle }) => {
    let me = game.playerSockets.filter(p => {
        return p.socketId === player.socketId
    })[0]

    let enemy = game.playerSockets.filter(p => {
        return p.socketId !== player.socketId
    })[0]

    let score = game.score

    setTitle({
        score: {
            me: me.nickname,
            myScore: score[me.socketId],
            enemy: enemy.nickname,
            enemyScore: score[enemy.socketId]
        }
    })
}

module.exports = { isMove, setScore }
