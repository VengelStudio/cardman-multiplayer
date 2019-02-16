const Cards = {
    DEFINITION_CARD: {
        id: 'DEFINITION_CARD',
        title: 'Definition card',
        description: 'Shows you a definition of the word.',
        use: () => {
            console.log('DEFINITION_CARD card used')
        }
    },
    RANDOM_CORRECT_LETTER_CARD: {
        id: 'RANDOM_CORRECT_LETTER_CARD',
        title: 'Random correct letter',
        description: 'Chooses a random correct letter.',
        use: () => {
            console.log('RANDOM_CORRECT_LETTER_CARD card used')
        }
    },
    REMOVE_ONE_UNFITTING_CARD: {
        id: 'REMOVE_ONE_UNFITTING_CARD',
        title: 'Remove one unfitting letter.',
        description: 'Removes one unfitting letter from the current word.',
        use: () => {
            console.log('REMOVE_ONE_UNFITTING_CARD card used')
        }
    },
    REMOVE_TWO_UNFITTING_CARD: {
        id: 'REMOVE_TWO_UNFITTING_CARD',
        title: 'Remove two unfitting letters.',
        description: 'Removes two unfitting letters from the current word.',
        use: () => {
            console.log('REMOVE_TWO_UNFITTING_CARD card used')
        }
    }
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
    Cards
}
