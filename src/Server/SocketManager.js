const io = require('./index.js').io

const {
  VERIFY_USERNAME,
  PLAYER_CONNECTED,
  PLAYER_DISCONNECTED,
  LOGOUT,
  INVITATION,
  INVITATION_ACCEPTED,
  GAME_STARTED,
  GAME_MOVE
} = require('../Events')

const { createPlayer, createGame, createTurn } = require('../Factories')

let connectedPlayers = {}
let games = {}

const { words, displayWord } = require('../Game/Words/Words')

module.exports = function(socket) {
  //console.log('Connected, socket id: ' + socket.id)

  socket.on(VERIFY_USERNAME, (nickname, callback) => {
    if (isPlayer(nickname)) {
      callback({ isTaken: true, player: null })
    } else {
      callback({
        isTaken: false,
        player: createPlayer({
          nickname: nickname,
          socketId: socket.id
        })
      })
      console.log(`[CONNECTED] Player ${nickname} (${socket.id})`)
    }
  })

  socket.on(PLAYER_CONNECTED, player => {
    player.socketId = socket.id
    connectedPlayers = addPlayer(player)
    socket.user = player

    io.emit(PLAYER_CONNECTED, { connectedPlayers })
  })

  socket.on('disconnect', () => {
    if ('user' in socket) {
      connectedPlayers = removePlayer(socket.user.nickname)
      io.emit(PLAYER_DISCONNECTED, connectedPlayers)
      //todo ${nickname} is not defined
      //console.log(`[DISCONNECTED] Player ${nickname} (${socket.user.username})`)
    }
  })

  socket.on(LOGOUT, () => {
    connectedPlayers = removePlayer(socket.user.nickname)
    io.emit(PLAYER_DISCONNECTED, connectedPlayers)
    console.log(`[LOGOUT] Player ${socket.user.username}`)
  })

  socket.on(INVITATION, ({ id = null, socketId = null }) => {
    if (socket.user.id === id) {
      console.log(`[ERROR] ${socket.user.username} tried to invite himself`)
      return
    }
    console.log(`[INVITATION] from ${socket.user.id} to ${id}`)
    socket.to(socketId).emit(INVITATION, {
      socketId: socket.user.socketId,
      nickname: socket.user.nickname
    })
  })

  socket.on(INVITATION_ACCEPTED, ({ fromSocketId, to }) => {
    console.log(`[INVITATION] from: ${fromSocketId}, to: ${to.socketId}`)

    let randomWord = getRandomWord()
    let playerSockets = [
      io.sockets.connected[fromSocketId].user,
      io.sockets.connected[to.socketId].user
    ]
    let game = createGame({
      word: randomWord,
      displayWord: displayWord({ word: randomWord.word }), //todo move to words.js someday
      playerSockets,
      nextPlayerIndex: Math.floor(Math.random() * playerSockets.length)
    })
    games = addGame(game)
    io.sockets.connected[fromSocketId].join(game.id)
    io.sockets.connected[to.socketId].join(game.id)
    io.in(game.id).emit(GAME_STARTED, { game })
    console.log(`[GAME] ${fromSocketId} vs ${to.socketId}, gameID: ${game.id}`)
  })

  socket.on(GAME_MOVE, ({ game, move }) => {
    //game.id
    console.log(game)
    console.log('[DEBUG] game id: ' + game.id)
    let currentGame = games[game.id]
    if (move.type === 'key') {
      let newGuessed = currentGame.guessed
      newGuessed.push(move.key)
      currentGame.displayWord = displayWord({
        word: currentGame.word.word,
        guessed: newGuessed
      })
      currentGame.guessed = newGuessed
    }
    games[game.id] = currentGame

    io.in(game.id).emit(GAME_MOVE, { game: games[game.id] })
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
  return username in connectedPlayers
}

function getRandomWord(/*usedwords*/) {
  //todo prevent from returning used words
  //todo app crashes (id null) after refreshing the page
  let index = Math.floor(Math.random() * words.length)
  let randomWord = words[index]
  return randomWord
}
