const uuidv4 = require('uuid/v4')

const createPlayer = ({ nickname = '', socketId = null, ip } = {}) => ({
    id: uuidv4(),
    ip,
    nickname,
    socketId,
    gameId: null,
    isInGame: false
})

const createGame = ({
    playerSockets,
    word,
    displayWord,
    nextPlayerIndex,
    guessed = []
}) => ({
    id: uuidv4(),
    readyCounter: 0,
    word,
    displayWord,
    guessed,
    playerSockets,
    nextPlayerIndex,
    blockCounters: {},
    score: {},
    cards: {},
    keys: [],
    dateTime: new Date().toJSON
})

module.exports = {
    createPlayer,
    createGame
}
