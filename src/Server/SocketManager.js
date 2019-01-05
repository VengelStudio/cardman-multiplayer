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

  socket.on(INVITATION, ({ id = null, socketId = null }) => {
    if (socket.user.id === id) {
      console.log('Player tried to invite himself. Error.')
      //todo error
      return
    }

    console.log('from: ')
    console.log(socket.user.id)
    console.log('to: ')
    console.log(id)
    console.log(socketId)

    //todo doesnt work in both ways

    io.sockets.connected[socketId].emit(INVITATION)
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
