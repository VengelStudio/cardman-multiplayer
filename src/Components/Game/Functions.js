const setScore = ({ player, game = null, score = null, setTitle }) => {
    let myNickname = player.nickname

    let me = null,
        enemy = null
    if (game !== null)
        me = game.playerSockets.filter(p => {
            return p.socketId === player.socketId
        })

    let myScore = 0,
        enemyScore = 0
    if (game !== null && score !== null) myScore = score[me[0].socketId]

    if (game !== null)
        enemy = game.playerSockets.filter(p => {
            return p.socketId !== player.socketId
        })

    if (game !== null && score !== null) enemyScore = score[enemy[0].socketId]

    if (game !== null) {
        let enemyNickname = enemy[0].nickname
        setTitle({
            score: {
                me: myNickname,
                myScore: myScore,
                enemy: enemyNickname,
                enemyScore: enemyScore
            }
        })
    }
}

const isMove = ({ game, player }) => {
    let nextPlayerIndex = game.nextPlayerIndex
    return game.playerSockets[nextPlayerIndex].id === player.id
}

module.exports = { setScore, isMove }

//todo something is null here
