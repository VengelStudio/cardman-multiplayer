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

module.exports = {
    addPlayer,
    addGame,
    removePlayer,
    isPlayer,
    getRandomWord
}
