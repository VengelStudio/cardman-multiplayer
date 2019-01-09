const uuidv4 = require('uuid/v4')

// Creates a player instance.
const createPlayer = ({ nickname = '', socketId = null } = {}) => ({
  id: uuidv4(),
  nickname,
  socketId
})

// Creates a game instance
const createGame = ({ players = [], cards = [], dateTime = null, socketRoom = null }) => ({
  id: uuidv4(),
  players,
  cards,
  dateTime,
  socketRoom
})

module.exports = {
  createPlayer,
  createGame
}
