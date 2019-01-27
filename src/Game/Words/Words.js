const data = require('./data.json')
const { getRandomWord } = require('../../Functions')

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
    let result1 = scoreObj[playerKeys[0]]
    let result2 = scoreObj[playerKeys[1]]
    if (result1 === 2 || result2 === 2) return true
    return false
}

let handleWin = (currentGame, nextPlayer) => {
    currentGame.guessed = []
    currentGame.score[nextPlayer.socketId] += 1
    let isGameWin = checkGameWin(currentGame.score)
    let winObject = {
        winner: nextPlayer,
        score: currentGame.score
    }
    if (isGameWin === true) {
        winObject = { ...winObject, type: 'game' }
    } else {
        let randomWord = getRandomWord(data.words)
        currentGame.word = randomWord
        currentGame.displayWord = displayWord({
            word: randomWord.word
        })

        winObject = {
            ...winObject,
            game: currentGame,
            type: 'turn'
        }
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
        //todo handle ties
    })
    return playerCounter > word.length / 2
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

module.exports = {
    displayWord,
    checkTurnWin,
    handleWin,
    words: data.words
}
