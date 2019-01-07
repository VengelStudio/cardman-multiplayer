const io = require('./index.js').io

const {
  VERIFY_USERNAME,
  PLAYER_CONNECTED,
  PLAYER_DISCONNECTED,
  LOGOUT,
  INVITATION,
  GAME_STARTED
} = require('../Events')

const { createPlayer } = require('../Factories')

let connectedPlayers = {}

module.exports = function(socket) {
  console.log('Connected, socket id: ' + socket.id)

  socket.on(VERIFY_USERNAME, (nickname, callback) => {
    if (isPlayer(nickname)) {
      callback({ isTaken: true, player: null })
    } else {
      callback({ isTaken: false, player: createPlayer({ nickname: nickname, socketId: socket.id }) })
    }
  })

  socket.on(PLAYER_CONNECTED, player => {
    player.socketId = socket.id
    connectedPlayers = addPlayer(player)
    socket.user = player

    io.emit(PLAYER_CONNECTED, { connectedPlayers })
    console.log(connectedPlayers)
  })

  socket.on('disconnect', () => {
    if ('user' in socket) {
      connectedPlayers = removePlayer(socket.user.nickname)
      io.emit(PLAYER_DISCONNECTED, connectedPlayers)
      console.log('Disconnect', connectedPlayers)
    }
  })

  socket.on(LOGOUT, () => {
    connectedPlayers = removePlayer(socket.user.nickname)
    io.emit(PLAYER_DISCONNECTED, connectedPlayers)
    console.log('Logout', connectedPlayers)
  })

  //the one that logs in first doesn't get the invitation
  //the second cannot invite the first
  socket.on(INVITATION, ({ id = null, socketId = null }) => {
    if (socket.user.id === id) {
      console.log('Player tried to invite himself. Error.')
      //todo error
      return
    }
    console.log(`New invite from ${socket.user.id} to ${id}`)
    socket.to(socketId).emit(INVITATION, { id: socket.user.id, nickname: socket.user.nickname })
  })
}

function addPlayer(player) {
  let newList = Object.assign({}, connectedPlayers)
  newList[player.nickname] = player
  return newList
}

function removePlayer(username) {
  let newList = Object.assign({}, connectedPlayers)
  delete newList[username]
  return newList
}

function isPlayer(username) {
  console.log(username)
  console.log(connectedPlayers)
  return username in connectedPlayers
}
