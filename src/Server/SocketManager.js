const io = require('./index.js').io

const {
  VERIFY_USERNAME,
  PLAYER_CONNECTED,
  PLAYER_DISCONNECTED,
  GET_PLAYERLIST,
  LOGOUT,
  INVITATION_RECEIVED,
  INVITATION_SENT,
  GAME_STARTED
} = require('../Events')

const { createPlayer } = require('../Factories')

let connectedPlayers = {}

module.exports = function(socket) {
  console.log('Socket Id:' + socket.id)
  socket.on(VERIFY_USERNAME, (nickname, callback) => {
    if (isPlayer(connectedPlayers, nickname)) {
      callback({ isTaken: true, player: null })
    } else {
      callback({ isTaken: false, player: createPlayer({ nickname: nickname, socketId: socket.id }) })
    }
  })

  socket.on(PLAYER_CONNECTED, player => {
    player.socketId = socket.id
    addPlayer(player)
    socket.user = player

    io.emit(PLAYER_CONNECTED, connectedPlayers)
    //io.broadcast.emit('broadcast', { connectedPlayers })
    console.log(connectedPlayers)
  })

  socket.on('disconnect', () => {
    if ('user' in socket) {
      removePlayer(socket.user.nickname)

      io.emit(PLAYER_DISCONNECTED, connectedPlayers)
      console.log('Disconnect', connectedPlayers)
    }
  })

  socket.on(LOGOUT, () => {
    removePlayer(socket.user.nickname)
    io.emit(PLAYER_DISCONNECTED, connectedPlayers)
    console.log('Logout', connectedPlayers)
  })

  socket.on(GET_PLAYERLIST, (data, callback) => {
    console.log(`${socket.user.nickname} just got player list.`)
    callback({ connectedPlayers })
  })
}

function addPlayer(player) {
  let newList = Object.assign({}, connectedPlayers)
  newList[player.nickname] = player
  connectedPlayers = newList
}

function removePlayer(username) {
  let newList = Object.assign({}, connectedPlayers)
  delete newList[username]
  connectedPlayers = newList
}

function isPlayer(username) {
  return username in connectedPlayers
}
