const Cards = {
    // DEFINITION_CARD: {
    //     id: 'DEFINITION_CARD',
    //     title: 'Definition card',
    //     description: 'Shows you a definition of the word.',
    //     use: () => {
    //         console.log('DEFINITION_CARD card used')
    //     }
    // },
    RANDOM_CORRECT_LETTER_CARD: {
        id: 'RANDOM_CORRECT_LETTER_CARD',
        title: 'Random correct letter',
        description: 'Chooses a random correct letter.',
        use: ({ currentGame, socket, move }) => {
            console.log('RANDOM_CORRECT_LETTER_CARD card used')

            let randomCorrectLetter = () => {
                //* random character from currentGame.word
                //* which is not included in guessed
                let { word } = currentGame.word
                for (let i = 0; i < word.length; i++) {
                    let letter = word[i].toLowerCase()
                    if (currentGame.guessed.includes(letter) === false) {
                        return letter.toLowerCase()
                    }
                }
                //todo error or exception
                return null
            }

            let newGuessed = currentGame.guessed
            newGuessed.push({
                key: randomCorrectLetter(),
                playerSocketId: move.playerSocketId
            })

            currentGame.nextPlayerIndex = 1 - currentGame.nextPlayerIndex

            currentGame.displayWord = displayWord({
                word: currentGame.word.word,
                guessed: newGuessed
            })
            const debugMode = true
            if (debugMode) {
                turnResult = Result.TURN_WIN
            } else {
                turnResult = checkTurnWin({
                    word: currentGame.word.word,
                    guessed: newGuessed,
                    player: socket.user
                })
            }

            if (turnResult !== Result.NOTHING) {
                //* modify our game object accordingly to the turn result
                let win = handleTurnResult(currentGame, nextPlayer, turnResult)
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
            }

            //* turnResult is neither WIN or TIE, so the turn is just moving on
            if (turnResult === Result.NOTHING) currentGame.guessed = newGuessed
        }
    }
    // REMOVE_ONE_UNFITTING_CARD: {
    //     id: 'REMOVE_ONE_UNFITTING_CARD',
    //     title: 'Remove one unfitting letter.',
    //     description: 'Removes one unfitting letter from the current word.',
    //     use: () => {
    //         console.log('REMOVE_ONE_UNFITTING_CARD card used')
    //     }
    // },
    // REMOVE_TWO_UNFITTING_CARD: {
    //     id: 'REMOVE_TWO_UNFITTING_CARD',
    //     title: 'Remove two unfitting letters.',
    //     description: 'Removes two unfitting letters from the current word.',
    //     use: () => {
    //         console.log('REMOVE_TWO_UNFITTING_CARD card used')
    //     }
    // },
    // BLOCK_CARD: {
    //     id: 'BLOCK_CARD',
    //     title: 'Block enemy for 2 turns.',
    //     description: 'Blocks enemy movement in the next two turns.',
    //     use: () => {
    //         console.log('BLOCK_CARD card used')
    //     }
    // },
    // IMMUNE_TO_BLOCK_CARD: {
    //     id: 'IMMUNE_TO_BLOCK_CARD',
    //     title: 'Immune to block.',
    //     description: 'Immune to block for 2 turns.',
    //     use: () => {
    //         console.log('IMMUNE_TO_BLOCK_CARD card used')
    //     }
    // },
    // ADDITIONAL_LETTER_CARD: {
    //     id: 'ADDITIONAL_LETTER_CARD',
    //     title: 'Additional letter',
    //     description: 'You can choose two letters in a turn.',
    //     use: () => {
    //         console.log('ADDITIONAL_LETTER_CARD card used')
    //     }
    // },
    // LOOK_UP_CARD: {
    //     id: 'LOOK_UP_CARD',
    //     title: 'Look up enemy card',
    //     description: 'You can look up one of the enemies cards.',
    //     use: () => {
    //         console.log('LOOK_UP_CARD card used')
    //     }
    // },
    // RANDOMIZE_YOURSELF_CARD: {
    //     id: 'RANDOMIZE_YOURSELF_CARD',
    //     title: 'Randomize a card',
    //     description: 'A random card of yours gets changed.',
    //     use: () => {
    //         console.log('RANDOMIZE_YOURSELF_CARD card used')
    //     }
    // },
    // RANDOMIZE_ENEMY_CARD: {
    //     id: 'RANDOMIZE_ENEMY_CARD',
    //     title: 'Randomize an enemies card',
    //     description: 'A random card of your opponent gets changed.',
    //     use: () => {
    //         console.log('RANDOMIZE_ENEMY_CARD card used')
    //     }
    // }
}

const getCard = card => {
    return Cards[card]
}

const getRandomCard = () => {
    let randomIndex = Math.floor(Math.random() * Object.keys(Cards).length)
    let randomKey = Object.keys(Cards)[randomIndex]
    return Cards[randomKey]
}

const generateCards = amount => {
    let result = []
    for (let i = 0; i < amount; i++) {
        result.push(getRandomCard())
    }
    return result
}

module.exports = {
    getRandomCard,
    generateCards,
    Cards,
    getCard
}
