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
function isIpFree(ip, connectedPlayers) {
    let ipAddresses = Object.values(connectedPlayers).map(e => { return e.ip })
    return !ipAddresses.includes(ip)
}

function getRandomWord(words) {
    let index = Math.floor(Math.random() * words.length)
    let randomWord = words[index]
    return randomWord
}

function removeUsedCard(game, card, id) {
    let cards = game.cards[id]
    let usedIndex = cards.findIndex(gameCard => gameCard.id === card.id)
    let newCards = []
    for (let i = 0; i < cards.length; i++) {
        if (i !== usedIndex) {
            newCards.push(cards[i])
        }
    }
    game.cards[id] = newCards
    return game.cards
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
    isIpFree,
    getRandomWord,
    setPlayersInGameStatus,
    removeUsedCard,
    removeGame
}
