const data = require('./data.json')

let countOccurrences = (word, char) => {
    let occurrence = 0
    Array.from(word).forEach(letter => {
        if (letter === char) {
            occurrence++
        }
    })
    return occurrence
}

let checkWin = (word, guessed, player) => {
    let playerSocketId = player.socketId
    let playerCounter = 0
    let enemyCounter = 0
    guessed.forEach(key => {
        if (key.playerSocketId === playerSocketId) {
            playerCounter += countOccurrences(word, key.key)
        } else {
            enemyCounter += countOccurrences(word, key.key)
        }
    })
    console.log(playerCounter)
    console.log(enemyCounter)
    return playerCounter > enemyCounter
}

let clearWord = word => {
    let result = ''

    word.split('').forEach(letter => {
        if (!(letter === ' ') && !(letter === '_')) {
            result += letter
        }
    })
    return result.toLowerCase()
}

let displayWord = ({
    word = null,
    guessed = [],
    winCallback = null,
    player = null
}) => {
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
    let guessedWord = result.replace('_', ' ')
    if (player !== null && checkWin(word, guessed, player)) {
        if (winCallback != null) winCallback()
    }
    return result.charAt(0).toUpperCase() + result.slice(1, result.length - 1)
}

module.exports = {
    displayWord,
    words: data.words
}
