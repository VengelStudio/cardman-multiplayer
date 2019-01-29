const uuidv4 = require('uuid/v4')

// Creates a player instance.
const createPlayer = ({ nickname = '', socketId = null } = {}) => ({
    id: uuidv4(),
    nickname,
    socketId,
})

// Creates a game instance
const createGame = ({
    playerSockets,
    word,
    displayWord,
    nextPlayerIndex,
    guessed = []
}) => ({
    id: uuidv4(),
    word,
    displayWord,
    guessed,
    playerSockets,
    nextPlayerIndex,
    score: {},
    dateTime: new Date().toJSON
})

module.exports = {
    createPlayer,
    createGame
}
