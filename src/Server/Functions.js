function addPlayer(player, connectedPlayers) {
    let newList = Object.assign({}, connectedPlayers)
    newList[player.nickname] = player
    return newList
}

function addGame(game, games) {
    let newList = Object.assign({}, games)
    newList[game.id] = game
    return newList
}

function removePlayer(username, connectedPlayers) {
    let newList = Object.assign({}, connectedPlayers)
    delete newList[username]
    return newList
}

function isPlayer(username, connectedPlayers) {
    return username in connectedPlayers
}

function getRandomWord(words) {
    let index = Math.floor(Math.random() * words.length)
    let randomWord = words[index]
    return randomWord
}

function setPlayersInGameStatus(connectedPlayers, players, boolean) {
    let newList = Object.assign({}, connectedPlayers)
    players.forEach(player => {
        newList[player.nickname].isInGame = boolean
    })
    console.log(newList)
    return newList
}

module.exports = {
    addPlayer,
    addGame,
    removePlayer,
    isPlayer,
    getRandomWord,
    setPlayersInGameStatus
}
