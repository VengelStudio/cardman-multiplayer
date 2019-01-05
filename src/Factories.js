const uuidv4 = require('uuid/v4')

// Creates a user.
const createPlayer = ({ nickname = '', socketId = null } = {}) => ({
  id: uuidv4(),
  nickname,
  socketId
})

module.exports = {
  createPlayer
}
