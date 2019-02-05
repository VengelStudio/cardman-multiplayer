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
    setPlayersInGameStatus
} = require('../Server/Functions')

let connectedPlayers = {}
let games = {}

const {
    words,
    displayWord,
    checkTurnWin,
    handleTurnResult
} = require('../Game/Words/Words')

const { TurnResultEnum } = require('../Shared/Enums')

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
            console.log(`[CONNECTED] Player ${nickname} (${socket.id})`)
        }
    })

    socket.on(PLAYER_CONNECTED, player => {
        player.socketId = socket.id
        connectedPlayers = addPlayer(player, connectedPlayers)
        socket.user = player

        io.emit(PLAYER_CONNECTED, { connectedPlayers })
    })

    socket.on('disconnect', () => {
        if ('user' in socket) {
            connectedPlayers = removePlayer(
                socket.user.nickname,
                connectedPlayers
            )
            io.emit(PLAYER_DISCONNECTED, { connectedPlayers })
            console.log(
                `[DISCONNECTED] Player ${socket.user.nickname} (${socket.id})`
            )
        }
    })

    socket.on(LOGOUT, () => {
        connectedPlayers = removePlayer(socket.user.nickname, connectedPlayers)
        io.emit(PLAYER_DISCONNECTED, connectedPlayers)
        console.log(`[LOGOUT] Player ${socket.user.username}`)
    })

    socket.on(INVITATION, ({ id = null, socketId = null }) => {
        let nickname = socket.user.nickname
        let fromSocketId = socket.user.socketId
        if (socket.user.id === id) {
            console.log(`[ERROR] ${nickname} tried to invite himself`)
        } else {
            console.log(`[INVITATION] from ${socket.user.id} to ${id}`)
            socket.to(socketId).emit(INVITATION, {
                socketId: fromSocketId,
                nickname
            })
        }
    })

    socket.on(INVITATION_ACCEPTED, ({ fromSocketId, to }) => {
        console.log(`[INVITATION] from: ${fromSocketId}, to: ${to.socketId}`)

        let randomWord = getRandomWord(words)
        let playerSockets = [
            io.sockets.connected[fromSocketId].user,
            io.sockets.connected[to.socketId].user
        ]

        //* players are in game
        connectedPlayers = setPlayersInGameStatus(
            connectedPlayers,
            playerSockets,
            true
        )

        socket.emit(REFRESH_PLAYERS, { connectedPlayers })

        let game = createGame({
            word: randomWord,
            displayWord: displayWord({ word: randomWord.word }),
            playerSockets,
            nextPlayerIndex: Math.floor(Math.random())
        })
        game.score[playerSockets[0].socketId] = 0
        game.score[playerSockets[1].socketId] = 0
        games = addGame(game, games)
        io.sockets.connected[fromSocketId].join(game.id)
        io.sockets.connected[to.socketId].join(game.id)
        io.in(game.id).emit(GAME_STARTED, { game })
        console.log(
            `[GAME] ${fromSocketId} vs ${to.socketId}, gameID: ${game.id}`
        )
    })

    socket.on(GAME_MOVE, ({ game, move }) => {
        let currentGame = games[game.id]
        let nextPlayerIndex = currentGame.nextPlayerIndex
        let nextPlayer = currentGame.playerSockets[nextPlayerIndex]
        let turnResult = null
        if (nextPlayer.id === socket.user.id) {
            if (move.type === 'key') {
                let newGuessed = currentGame.guessed
                newGuessed.push({
                    key: move.key,
                    playerSocketId: move.playerSocketId
                })

                //*switching player turns
                //prettier-ignore
                currentGame.nextPlayerIndex = currentGame.nextPlayerIndex === 0 ? 1 : 0

                //*display our word regarding guessed letters
                currentGame.displayWord = displayWord({
                    word: currentGame.word.word,
                    guessed: newGuessed
                })

                turnResult = checkTurnWin({
                    word: currentGame.word.word,
                    guessed: newGuessed,
                    player: socket.user
                })
                //* turnResult is TIE or WIN
                if (turnResult !== TurnResultEnum.NOTHING) {
                    //* alter our game object accordingly to the turn result
                    //todo seperate socket for connectedPlayers
                    let win = handleTurnResult(
                        currentGame,
                        nextPlayer,
                        turnResult
                    )
                    currentGame = win.currentGame
                    if (win.winObject.type === 'game') {
                        connectedPlayers = setPlayersInGameStatus(
                            connectedPlayers,
                            currentGame.playerSockets,
                            false
                        )
                    }
                    io.in(game.id).emit(WIN, win.winObject)
                    socket.emit(REFRESH_PLAYERS, { connectedPlayers })
                }

                //* turnResult is neither WIN or TIE, so the turn is just moving on
                if (turnResult === TurnResultEnum.NOTHING)
                    currentGame.guessed = newGuessed
            }

            //* save altered game
            games[game.id] = currentGame
            if (turnResult === TurnResultEnum.NOTHING) {
                io.in(game.id).emit(GAME_MOVE, { game: games[game.id] })
            }
        }
    })
}
