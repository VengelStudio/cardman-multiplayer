const io = require('./index.js').io

const {
    VERIFY_USERNAME,
    PLAYER_CONNECTED,
    PLAYER_DISCONNECTED,
    LOGOUT,
    INVITATION,
    INVITATION_ACCEPTED,
    GAME_STARTED,
    GAME_MOVE,
    WIN,
    REFRESH_PLAYERS
} = require('../Shared/Events')

const { createPlayer, createGame } = require('../Server/Factories')
const {
    addPlayer,
    addGame,
    removePlayer,
    isPlayer,
    getRandomWord,
    setPlayersInGameStatus,
    removeGame
} = require('../Server/Functions')

let connectedPlayers = {}
let games = {}

const {
    words,
    displayWord,
    checkWin,
    handleWin
} = require('../Game/Words/Words')

const { Result } = require('../Shared/Enums')
const { generateCards, getCard } = require('../Game/Cards/Cards')

module.exports = function(socket) {
    //console.log('Connected, socket id: ' + socket.id)

    socket.on(VERIFY_USERNAME, (nickname, callback) => {
        if (isPlayer(nickname, connectedPlayers)) {
            callback({ isTaken: true, player: null })
        } else {
            callback({
                isTaken: false,
                player: createPlayer({
                    nickname: nickname,
                    socketId: socket.id
                })
            })
            console.log(`[CONNECTED] Player ${nickname} (${socket.id}).`)
        }
    })

    socket.on(PLAYER_CONNECTED, player => {
        player.socketId = socket.id
        connectedPlayers = addPlayer(player, connectedPlayers)
        socket.user = player

        socket.emit(PLAYER_CONNECTED, { connectedPlayers })
        io.emit(REFRESH_PLAYERS, { connectedPlayers })
    })

    socket.on('disconnect', () => {
        if ('user' in socket) {
            connectedPlayers = removePlayer(
                socket.user.nickname,
                connectedPlayers
            )
            io.emit(PLAYER_DISCONNECTED, { connectedPlayers })
            console.log(
                `[DISCONNECTED] Player ${socket.user.nickname} (${socket.id}).`
            )

            let { gameId } = socket.user
            if (gameId !== null && games[gameId] !== undefined) {
                let playersGame = games[socket.user.gameId]
                //* switch to opponent and let him win
                let playerIndex = playersGame.nextPlayerIndex === 0 ? 1 : 0
                let player = playersGame.playerSockets[playerIndex]
                playersGame.score[player.socketId] += 1

                let winObject = {
                    winner: player,
                    score: playersGame.score,
                    game: playersGame,
                    type: Result.GAME_WIN
                }

                connectedPlayers = setPlayersInGameStatus(
                    connectedPlayers,
                    playersGame.playerSockets,
                    false
                )

                games = removeGame(playersGame, games)
                io.in(socket.user.gameId).emit(WIN, winObject)
                io.emit(REFRESH_PLAYERS, { connectedPlayers })
            }
        }
    })

    socket.on(LOGOUT, () => {
        connectedPlayers = removePlayer(socket.user.nickname, connectedPlayers)
        io.emit(PLAYER_DISCONNECTED, { connectedPlayers })
        console.log(`[LOGOUT] Player ${socket.user.username}.`)
    })

    socket.on(INVITATION, ({ id = null, socketId = null }) => {
        let nickname = socket.user.nickname
        let fromSocketId = socket.user.socketId
        if (socket.user.id === id) {
            console.log(`[ERROR] ${nickname} tried to invite himself.`)
        } else {
            console.log(`[INVITATION] from ${socket.user.id} to ${id}.`)
            socket.to(socketId).emit(INVITATION, {
                socketId: fromSocketId,
                nickname
            })
        }
    })

    socket.on(INVITATION_ACCEPTED, ({ fromSocketId, to }) => {
        console.log(`[INVITATION] from: ${fromSocketId}, to: ${to.socketId}.`)

        let randomWord = getRandomWord(words)
        let playerSockets = [
            io.sockets.connected[fromSocketId].user,
            io.sockets.connected[to.socketId].user
        ]

        let game = createGame({
            word: randomWord,
            playerSockets,
            nextPlayerIndex: Math.floor(Math.random())
        })

        game.displayWord = displayWord(game)

        for (let i = 0; i <= 1; i++) {
            game.score[playerSockets[i].socketId] = 0
            game.cards[playerSockets[i].socketId] = generateCards(3)
        }

        games = addGame(game, games)
        io.sockets.connected[fromSocketId].join(game.id)
        io.sockets.connected[to.socketId].join(game.id)

        //* players are in game
        connectedPlayers = setPlayersInGameStatus(
            connectedPlayers,
            playerSockets,
            true,
            game
        )
        io.emit(REFRESH_PLAYERS, { connectedPlayers })

        io.in(game.id).emit(GAME_STARTED, { game })
        console.log(
            `[GAME] ${fromSocketId} vs ${to.socketId}, gameID: ${game.id}.`
        )
    })

    socket.on(GAME_MOVE, ({ game, move }) => {
        let currentGame = games[game.id]
        let player = game.playerSockets[game.nextPlayerIndex]
        if (player.id === socket.user.id) {
            if (move.type === 'key') {
                currentGame.guessed.push({
                    key: move.key,
                    playerSocketId: move.playerSocketId
                })
            } else if (move.type === 'card') {
                let cardName = move.card.card
                let card = getCard(cardName)
                currentGame = card.use({ currentGame, socket, move })
            }

            currentGame.displayWord = displayWord(currentGame)

            const debugMode = false

            let result = checkWin(currentGame, socket)
            if (debugMode) result = Result.TURN_WIN
            currentGame.nextPlayerIndex = 1 - currentGame.nextPlayerIndex

            if (result !== Result.NOTHING) {
                let win = handleWin(currentGame, result)
                currentGame = win.currentGame
                if (win.winObject.type === Result.GAME_WIN) {
                    connectedPlayers = setPlayersInGameStatus(
                        connectedPlayers,
                        currentGame.playerSockets,
                        false
                    )
                    games = removeGame(game, games)
                }
                io.in(game.id).emit(WIN, win.winObject)
                io.emit(REFRESH_PLAYERS, { connectedPlayers })
                return
            }
            games[game.id] = currentGame
            io.in(game.id).emit(GAME_MOVE, { game: games[game.id] })
        }
    })
}
