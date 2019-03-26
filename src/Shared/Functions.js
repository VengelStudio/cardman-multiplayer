const isMove = ({ game, player }) => {
    let nextPlayerIndex = game.nextPlayerIndex
    return game.playerSockets[nextPlayerIndex].id === player.id
}

const setScore = ({ player, game, setTitle }) => {
    let { socketId } = player
    let { playerSockets } = game
    let me =
        playerSockets.find(p => {
            return p.socketId === socketId
        }) || []

    let enemy =
        playerSockets.find(p => {
            return p.socketId !== socketId
        }) || []

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
