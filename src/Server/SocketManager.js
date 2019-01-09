const io = require('./index.js').io

const {
  VERIFY_USERNAME,
  PLAYER_CONNECTED,
  PLAYER_DISCONNECTED,
  LOGOUT,
  INVITATION,
  INVITATION_ACCEPTED,
  GAME_STARTED
} = require('../Events')

const { createPlayer, createGame } = require('../Factories')

let connectedPlayers = {}
let games = {}

module.exports = function (socket) {
  console.log('Connected, socket id: ' + socket.id)

  socket.on(VERIFY_USERNAME, (nickname, callback) => {
    if (isPlayer(nickname)) {
      callback({ isTaken: true, player: null })
    } else {
      callback({
        isTaken: false, player: createPlayer({
          nickname: nickname,
          socketId: socket.id
        })
      })
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
  socket.on(INVITATION, ({ id = null, socketId = null }) => {
    if (socket.user.id === id) {
      console.log('Player tried to invite himself. Error.')
      return
    }
    console.log(`New invite from ${socket.user.id} to ${id}`)
    socket.to(socketId).emit(INVITATION, {
      socketId: socket.user.socketId,
      nickname: socket.user.nickname
    })
  })

  socket.on(INVITATION_ACCEPTED, ({ fromSocketId, to }) => {
    console.log(`From: ${fromSocketId}, to: ${to.socketId}`)
    let game = createGame({
      players: [fromSocketId, to.socketId]
    })
    addGame(game)
    console.log(games)
    console.log(`Started game between ${fromSocketId} and ${to.socketId}, gameID: ${game.id}`)
  })
}

function addPlayer(player) {
  let newList = Object.assign({}, connectedPlayers)
  newList[player.nickname] = player
  return newList
}

function addGame(game) {
  let newList = Object.assign({}, games)
  newList[game.id] = game
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
