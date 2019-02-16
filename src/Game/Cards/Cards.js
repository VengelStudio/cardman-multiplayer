const Cards = {
    DEFINITION_CARD: {
        id: 'DEFINITION_CARD',
        title: 'Definition card',
        description: 'Shows you a definition of the current word.',
        use: () => {
            console.log('card used')
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
