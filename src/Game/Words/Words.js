const data = require('./data.json')
const { getRandomWord } = require('../../Server/Functions')
const { Result } = require('../../Shared/Enums')

let countOccurrences = (word, char) => {
    let occurrence = 0
    Array.from(word).forEach(letter => {
        if (letter === char) {
            occurrence++
        }
    })
    return occurrence
}

let checkGameWin = scoreObj => {
    let playerKeys = Object.keys(scoreObj)
    //todo use some here
    let result1 = scoreObj[playerKeys[0]]
    let result2 = scoreObj[playerKeys[1]]
    if (result1 === 2 || result2 === 2) return true
    return false
}

let handleTurnResult = (currentGame, nextPlayer, result) => {
    let winObject = null
    if (result === Result.TURN_WIN) {
        currentGame.guessed = []
        currentGame.score[nextPlayer.socketId] += 1
        let isGameWin = checkGameWin(currentGame.score)
        winObject = {
            winner: nextPlayer,
            score: currentGame.score
        }
        if (isGameWin === true) {
            winObject = {
                ...winObject,
                game: currentGame,
                type: Result.GAME_WIN
            }
        } else {
            let randomWord = getRandomWord(data.words)
            currentGame.word = randomWord
            currentGame.displayWord = displayWord({
                word: randomWord.word
            })

            winObject = {
                ...winObject,
                game: currentGame,
                type: Result.TURN_WIN
            }
        }
    } else if (result === Result.GAME_TIE) {
        currentGame.guessed = []
        let randomWord = getRandomWord(data.words)
        currentGame.word = randomWord
        currentGame.displayWord = displayWord({
            word: randomWord.word
        })

        winObject = {
            winner: null,
            score: null,
            game: currentGame,
            type: Result.GAME_TIE
        }
        //todo use the same enum (and extend it) on the front-end
    }

    return {
        currentGame,
        winObject
    }
}

let checkTurnWin = ({ word, guessed, player }) => {
    let playerSocketId = player.socketId
    let playerCounter = 0
    let enemyCounter = 0
    guessed.forEach(key => {
        let occurrences = countOccurrences(word.toUpperCase(), key.key)

        if (key.playerSocketId === playerSocketId) {
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

let displayWord = ({ word = null, guessed = [] }) => {
    let result = ''
    console.log('[DEBUG]: ' + word)
    let wordArray = word.toUpperCase().split('')

    let guessedKeys = []

    for (let j = 0; j < guessed.length; j++) {
        guessedKeys.push(guessed[j].key)
    }
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
    checkTurnWin,
    handleTurnResult,
    words: data.words
}
