const data = require('./data.json')
const { getRandomWord } = require('../../Server/Functions')
const { Result } = require('../../Shared/Enums')

let countOccurrences = (word, char) => {
    let { key } = char
    word = word.toUpperCase()
    let occurrence = 0
    Array.from(word).forEach(letter => {
        if (letter === key) {
            occurrence++
        }
    })
    return occurrence
}

let checkGameWin = game => {
    let { score } = game
    let playerKeys = Object.keys(score)
    //todo use some here
    let result1 = score[playerKeys[0]]
    let result2 = score[playerKeys[1]]
    if (result1 === 2 || result2 === 2) return true
    return false
}

let handleWin = (game, result) => {
    let { nextPlayerIndex } = game
    nextPlayerIndex = 1 - nextPlayerIndex
    let nextPlayer = game.playerSockets[nextPlayerIndex]
    let winObject = null
    if (result === Result.TURN_WIN) {
        game.guessed = []
        game.keys = []
        game.score[nextPlayer.socketId] += 1
        winObject = {
            winner: nextPlayer,
            score: game.score
        }
        if (checkGameWin(game) === true) {
            winObject = {
                ...winObject,
                game,
                type: Result.GAME_WIN
            }
        } else if (result === Result.TURN_WIN) {
            let randomWord = getRandomWord(data.words)
            game.word = randomWord
            game.displayWord = displayWord(game)

            winObject = {
                ...winObject,
                game,
                type: Result.TURN_WIN
            }
        }
    } else if (result === Result.TURN_TIE) {
        game.guessed = []
        game.keys = []
        let randomWord = getRandomWord(data.words)
        game.word = randomWord
        game.displayWord = displayWord(game)

        winObject = {
            winner: null,
            score: null,
            game,
            type: Result.TURN_TIE
        }
    }

    return {
        game,
        winObject
    }
}

let checkWin = (game, socket) => {
    let { socketId } = socket.user
    let { word } = game.word
    let { guessed } = game
    let playerCounter = 0
    let enemyCounter = 0
    guessed.forEach(key => {
        let occurrences = countOccurrences(word, key)
        if (key.playerSocketId === socketId) {
            playerCounter += occurrences
        } else {
            enemyCounter += occurrences
        }
    })
    if (playerCounter > word.length / 2) {
        return Result.TURN_WIN
    } else if (playerCounter + enemyCounter === word.length) {
        return Result.TURN_TIE
    } else {
        return Result.NOTHING
    }
}

let displayWord = game => {
    let { word } = game.word
    let { guessed } = game

    let result = ''
    console.log('[DEBUG]: ' + word)
    let wordArray = word.toUpperCase().split('')

    const guessedKeys = guessed.map(e => e.key)

    for (let i = 0; i < wordArray.length; i++) {
        if (guessedKeys.includes(wordArray[i])) {
            result += wordArray[i] + ' '
        } else {
            result += '_ '
        }
    }

    return result.charAt(0).toUpperCase() + result.slice(1, result.length - 1)
}

let onKeyMove = () => {}

module.exports = {
    displayWord,
    checkWin,
    handleWin,
    words: data.words
}
