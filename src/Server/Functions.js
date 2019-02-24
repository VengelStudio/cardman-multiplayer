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

function removeGame(game, games) {
    let newList = Object.assign({}, games)
    delete newList[game.id]
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

function removeUsedCard(game, card, id) {
    let usedIndex = game.cards[id].findIndex(
        gameCard => gameCard.id === card.id
    )
    game.cards[id] = game.cards[id].slice(usedIndex + 1)
    console.log(game.cards)
    return game.cards
    //return myCards.filter(carden => carden.id !== card.id)
}

function setPlayersInGameStatus(
    connectedPlayers,
    players,
    boolean,
    game = null
) {
    let newList = Object.assign({}, connectedPlayers)
    players.forEach(player => {
        if (newList[player.nickname] !== undefined) {
            newList[player.nickname].isInGame = boolean
            if (game !== null) newList[player.nickname].gameId = game.id
        }
    })
    return newList
}

module.exports = {
    addPlayer,
    addGame,
    removePlayer,
    isPlayer,
    getRandomWord,
    setPlayersInGameStatus,
    removeUsedCard,
    removeGame
}
