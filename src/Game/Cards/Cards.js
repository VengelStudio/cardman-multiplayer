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
            let randomCorrectLetter = () => {
                let { word } = currentGame.word
                let { guessed } = currentGame
                let guessedArr = guessed.map(g => g.key.toUpperCase())
                word = word.toUpperCase()
                let arr = Array.from(word).filter(char => {
                    return !guessedArr.includes(char)
                })
                let randomIndex = Math.floor(Math.random() * arr.length)
                return arr[randomIndex].toUpperCase()
            }

            currentGame.guessed.push({
                key: randomCorrectLetter(),
                playerSocketId: move.playerSocketId
            })
            return currentGame
        }
    },
    // ADDITIONAL_LETTER_CARD: {
    //     id: 'ADDITIONAL_LETTER_CARD',
    //     title: 'Additional letter',
    //     description: 'You can choose two letters in a turn.',
    //     use: ({ currentGame, socket, move }) => {
    //         console.log('ADDITIONAL_LETTER_CARD card used')
    //         currentGame.nextPlayerIndex = 1 - currentGame.nextPlayerIndex
    //         return currentGame
    //     }
    // },
    REMOVE_ONE_UNFITTING_CARD: {
        id: 'REMOVE_ONE_UNFITTING_CARD',
        title: 'Remove one unfitting letter.',
        description: 'Removes one unfitting letter from the current word.',
        use: ({ currentGame, socket, move }) => {
            let { word } = currentGame.word
            let wordKeys = Array.from(word.toUpperCase())
            for (let i = 65; i <= 90; i++) {
                let letter = String.fromCharCode(i).toUpperCase()
                if (!wordKeys.includes(letter)) {
                    currentGame.keys.push({
                        key: letter,
                        playerSocketId: socket.user.socketId
                    })
                    return currentGame
                }
            }
            return currentGame
        }
    },
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
    // LOOK_UP_CARD: {
    //     id: 'LOOK_UP_CARD',
    //     title: 'Look up enemy card',
    //     description: 'You can look up one of the enemies cards.',
    //     use: ({ currentGame, socket, move }) => {
    //         console.log('LOOK_UP_CARD card used')
    //         let myCards = currentGame.cards[move.playerSocketId]
    //         let enemySocket = Object.keys(currentGame.cards).filter(s => { s != move.playerSocketId })
    //         let enemyCards = currentGame.cards[enemySocket]
    //     }
    // },
    SWAP_RANDOM_CARDS: {
        id: 'SWAP_RANDOM_CARDS',
        title: 'Swap with opponent.',
        description: 'Swap your card for a random opponents card ',
        use: ({ currentGame, socket, move }) => {
            let enemySocket = currentGame.playerSockets.filter(e => {
                return e.socketId != move.playerSocketId
            })[0].socketId
            let enemyCards = currentGame.cards[enemySocket]
            let myCards = currentGame.cards[move.playerSocketId]

            let randomIndexOfMine = Math.floor(Math.random() * myCards.length)
            let randomIndexOfOpponent = Math.floor(
                Math.random() * enemyCards.length
            )

            if (enemyCards.length >= 1 && myCards.length >= 2) {
                let a = myCards[randomIndexOfMine]
                enemyCards[randomIndexOfOpponent] = a
                myCards[randomIndexOfMine] = enemyCards[randomIndexOfOpponent]
                currentGame.cards[enemySocket] = enemyCards
                currentGame.cards[move.playerSocketId] = myCards
            }

            return currentGame
        }
    },
    RANDOMIZE_YOURSELF_CARD: {
        id: 'RANDOMIZE_YOURSELF_CARD',
        title: 'Randomize a card',
        description: 'A random card of yours gets changed.',
        use: ({ currentGame, socket, move }) => {
            let getRandomCard = (exception = null) => {
                let excluded = ['RANDOMIZE_YOURSELF_CARD', exception]
                let included = Object.values(Cards).filter(
                    card => !excluded.includes(card.id)
                )
                let randomIndex = Math.floor(Math.random() * included.length)
                return included[randomIndex]
            }
            currentGame.cards[move.playerSocketId].push(getRandomCard())
            return currentGame
        }
    },
    RANDOMIZE_ENEMY_CARD: {
        id: 'RANDOMIZE_ENEMY_CARD',
        title: 'Randomize an enemies card',
        description: 'A random card of your opponent gets changed.',
        use: ({ currentGame, socket, move }) => {
            console.log('RANDOMIZE_ENEMY_CARD card used')

            let enemySocket = currentGame.playerSockets.filter(e => {
                return e.socketId != move.playerSocketId
            })[0].socketId

            let getRandomCard = (exception = null) => {
                let excluded = ['RANDOMIZE_YOURSELF_CARD', exception]
                let included = Object.values(Cards).filter(
                    card => !excluded.includes(card.id)
                )
                let randomIndex = Math.floor(Math.random() * included.length)
                return included[randomIndex]
            }
            let enemyCardAmount = currentGame.cards[enemySocket].length
            let randomIndex = Math.floor(Math.random() * enemyCardAmount)
            if (enemyCardAmount > 0) {
                currentGame.cards[enemySocket][randomIndex] = getRandomCard()
            }
            return currentGame
        }
    }
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

const resupplyCards = game => {
    let { cards } = game
    for (player of Object.keys(cards)) {
        let newCards = cards[player]
        if (newCards.length < 3) {
            newCards.push(getRandomCard())
        }
        cards[player] = newCards
    }
    return cards
}

module.exports = {
    getRandomCard,
    generateCards,
    Cards,
    getCard,
    resupplyCards
}
