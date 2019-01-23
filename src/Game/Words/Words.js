const data = require('./data.json')

let clearWord = word => {
    let result = ''

    word.split('').forEach(letter => {
        if (!(letter === ' ') && !(letter === '_')) {
            result += letter
        }
    })
    return result.toLowerCase()
}

let displayWord = ({ word = null, guessed = [], winCallback = null }) => {
    //todo force uppercase

    // guessed = [{
    //     key: "A",
    // },]

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
    if (clearWord(result) === clearWord(word)) {
        if (winCallback != null) winCallback()
    }
    return result.charAt(0).toUpperCase() + result.slice(1, result.length - 1)
}

module.exports = {
    displayWord,
    words: data.words
}
