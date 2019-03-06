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
    REFRESH_PLAYERS,
    WALKTHROUGH_READY,
    GAME_CREATED
} = require('../Shared/Events')

const { createPlayer, createGame } = require('../Server/Factories')
const {
    addPlayer,
    addGame,
    removePlayer,
    isPlayer,
    getRandomWord,
    setPlayersInGameStatus,
    removeUsedCard,
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
const { generateCards, getCard, resupplyCards } = require('../Game/Cards/Cards')

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
        console.log('disconnect')
        if ('user' in socket) {
            connectedPlayers = removePlayer(
                socket.user.nickname,
                connectedPlayers
            )
            console.log(
                `[DISCONNECTED] Player ${socket.user.nickname} (${socket.id}).`
            )
            try {
                let isGameActive = socket.user.gameId !== null
                if (isGameActive) {
                    let disconnectedSocketId = socket.user.socketId

                    let { gameId } = socket.user
                    let playersGame = games[gameId]
                    let remainingPlayer = playersGame.playerSockets.filter(
                        s => s.socketId !== disconnectedSocketId
                    )[0]
                    playersGame.score[remainingPlayer.socketId] += 1

                    let winObject = {
                        winner: remainingPlayer,
                        score: playersGame.score,
                        game: playersGame,
                        type: Result.GAME_WIN
                    }

                    games = removeGame(playersGame, games)
                    io.in(gameId).emit(WIN, winObject)

                    let remainingSocket =
                        io.sockets.connected[remainingPlayer.socketId]
                    remainingSocket.leave(gameId)

                    connectedPlayers = setPlayersInGameStatus(
                        connectedPlayers,
                        playersGame.playerSockets,
                        false
                    )
                }

                io.emit(PLAYER_DISCONNECTED, { connectedPlayers })
                io.emit(REFRESH_PLAYERS, { connectedPlayers })
            } catch (e) {
                console.log(e)
            }
        }
    })

    socket.on(LOGOUT, () => {
        console.log('LOGOUT')
        try {
            let { nickname } = socket.user
            connectedPlayers = removePlayer(nickname, connectedPlayers)
            console.log(`[LOGOUT] Player ${nickname}.`)
        } catch (e) {
            console.log(e)
        }
        io.emit(PLAYER_DISCONNECTED, { connectedPlayers })
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

        let playerSockets = [
            io.sockets.connected[fromSocketId].user,
            io.sockets.connected[to.socketId].user
        ]

        let game = createGame({
            word: getRandomWord(words),
            playerSockets,
            nextPlayerIndex: Math.round(Math.random())
        })

        game.displayWord = displayWord(game)

        for (let i = 0; i <= 1; i++) {
            game.score[playerSockets[i].socketId] = 0
            game.blockCounters[playerSockets[i].socketId] = 0
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
        io.in(game.id).emit(GAME_CREATED, { gameId: game.id })

        console.log(
            `[GAME] ${fromSocketId} vs ${to.socketId}, gameID: ${game.id}.`
        )
    })

    socket.on(WALKTHROUGH_READY, ({ gameId }) => {
        if (games[gameId].readyCounter === 1) {
            io.in(gameId).emit(GAME_STARTED, { game: games[gameId] })
        }
        games[gameId].readyCounter = 1
    })

    socket.on(GAME_MOVE, ({ game, moves }) => {
        let currentGame = games[game.id]
        let player = game.playerSockets[game.nextPlayerIndex]
        let enemy = game.playerSockets[1 - game.nextPlayerIndex]

        let blockCounter = currentGame.blockCounters[player.socketId]
        if (player.id === socket.user.id) {
            moves = moves.sort((a, b) => {
                if (a.type === 'key') return -1
                else return 1
            })
            moves.forEach(move => {
                if (move.type === 'key') {
                    currentGame.guessed.push({
                        key: move.key,
                        playerSocketId: move.playerSocketId
                    })
                    currentGame.keys.push({
                        key: move.key,
                        playerSocketId: move.playerSocketId
                    })
                    currentGame.keys.push({
                        key: move.key,
                        playerSocketId: enemy.socketId
                    })
                } else if (move.type === 'card' && blockCounter === 0) {
                    let cardName = move.card
                    let card = getCard(cardName)
                    currentGame = card.use({ currentGame, socket, move })
                    currentGame.cards = removeUsedCard(
                        currentGame,
                        card,
                        move.playerSocketId
                    )
                }
            })
            if (blockCounter > 0)
                currentGame.blockCounters[player.socketId] = blockCounter - 1
            if (blockCounter < 0)
                currentGame.blockCounters[player.socketId] = blockCounter + 1

            currentGame.displayWord = displayWord(currentGame)

            const debugMode = false

            let result = checkWin(currentGame, socket)
            if (debugMode) result = Result.TURN_WIN
            currentGame.nextPlayerIndex = 1 - currentGame.nextPlayerIndex

            if (result !== Result.NOTHING) {
                let win = handleWin(currentGame, result)
                currentGame = win.game
                let winType = win.winObject.type
                if (winType === Result.GAME_WIN) {
                    connectedPlayers = setPlayersInGameStatus(
                        connectedPlayers,
                        currentGame.playerSockets,
                        false
                    )
                    games = removeGame(game, games)
                } else if (
                    winType === Result.TURN_WIN ||
                    winType === Result.TURN_TIE
                ) {
                    currentGame.cards = resupplyCards(currentGame)
                    currentGame.blockCounters[player.socketId] = 0
                    currentGame.blockCounters[enemy.socketId] = 0
                }
                io.in(game.id).emit(WIN, win.winObject)
                if (winType === Result.GAME_WIN) {
                    io.sockets.connected[player.socketId].leave(game.id)
                    io.sockets.connected[enemy.socketId].leave(game.id)
                }
                io.emit(REFRESH_PLAYERS, { connectedPlayers })
                return
            }
            games[game.id] = currentGame
            io.in(game.id).emit(GAME_MOVE, { game: games[game.id] })
        }
    })
}
