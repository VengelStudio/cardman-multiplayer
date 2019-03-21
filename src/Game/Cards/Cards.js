const Cards = {
    DEFINITION_CARD: {
        id: 'DEFINITION_CARD',
        title: 'Definition card',
        description: 'Shows you a definition of the word.',
        disabledText: '',
        use: ({ currentGame, socket, move }) => {
            return currentGame
        },
        doesMeetConditions: ({ game, player, index }) => {
            let { socketId } = player
            let firstCardIndex = game.cards[socketId].findIndex(card => {
                return card.id === Cards.DEFINITION_CARD.id
            })
            if (index === firstCardIndex) return true
            return false
        }
    },
    // RANDOM_CORRECT_LETTER_CARD: {
    //     id: 'RANDOM_CORRECT_LETTER_CARD',
    //     title: 'Random correct letter',
    //     description: 'Chooses a random correct letter.',
    //     use: ({ currentGame, socket, move }) => {
    //         let randomCorrectLetter = () => {
    //             let { word } = currentGame.word
    //             let { guessed } = currentGame
    //             let guessedArr = guessed.map(g => g.key.toUpperCase())
    //             word = word.toUpperCase()
    //             let arr = Array.from(word).filter(char => {
    //                 return !guessedArr.includes(char)
    //             })
    //             let randomIndex = Math.floor(Math.random() * arr.length)
    //             return arr[randomIndex].toUpperCase()
    //         }

    //         let key = randomCorrectLetter()
    //         currentGame.guessed.push({
    //             key,
    //             playerSocketId: move.playerSocketId
    //         })
    //         let playerSocket =
    //             currentGame.playerSockets[currentGame.nextPlayerIndex].socketId
    //         let enemySocket =
    //             currentGame.playerSockets[1 - currentGame.nextPlayerIndex]
    //                 .socketId
    //         currentGame.keys.push({
    //             key,
    //             playerSocketId: playerSocket
    //         })
    //         currentGame.keys.push({
    //             key,
    //             playerSocketId: enemySocket
    //         })
    //         return currentGame
    //     },
    //     doesMeetConditions: ({game}) => {
    //         return true
    //     }
    // },
    ADDITIONAL_TURN_CARD: {
        id: 'ADDITIONAL_TURN_CARD',
        title: 'Additional letter',
        description: 'You can choose two letters in a turn.',
        disabledText: 'diseblyd',
        use: ({ currentGame, socket, move }) => {
            currentGame.nextPlayerIndex = 1 - currentGame.nextPlayerIndex
            return currentGame
        },
        doesMeetConditions: ({ game, player, index }) => {
            let { socketId } = player
            let firstCardIndex = game.cards[socketId].findIndex(card => {
                return card.id === Cards.ADDITIONAL_TURN_CARD.id
            })
            if (index === firstCardIndex) return true
            return false
        }
    },
    // REMOVE_ONE_UNFITTING_CARD: {
    //     id: 'REMOVE_ONE_UNFITTING_CARD',
    //     title: 'Remove one unfitting letter.',
    //     description: 'Removes one unfitting letter from the current word.',
    //     use: ({ currentGame, socket, move }) => {
    //         let { word } = currentGame.word
    //         let wordKeys = Array.from(word.toUpperCase())
    //         let myKeys = []
    //         currentGame.keys.forEach(key => {
    //             if (key.playerSocketId === socket.user.socketId) {
    //                 myKeys.push(key.key)
    //             }
    //         })
    //         let candidates = []
    //         for (let i = 65; i <= 90; i++) {
    //             let letter = String.fromCharCode(i).toUpperCase()
    //             if (!wordKeys.includes(letter) && !myKeys.includes(letter)) {
    //                 candidates.push(letter)
    //             }
    //         }
    //         currentGame.keys.push({
    //             key: candidates[Math.floor(Math.random() * candidates.length)],
    //             playerSocketId: socket.user.socketId
    //         })
    //         return currentGame
    //     },
    //     doesMeetConditions: ({game}) => {
    //         return true
    //     }
    // },
    // REMOVE_TWO_UNFITTING_CARD: {
    //     id: 'REMOVE_TWO_UNFITTING_CARD',
    //     title: 'Remove two unfitting letters.',
    //     description: 'Removes two unfitting letters from the current word.',
    //     use: ({ currentGame, socket, move }) => {
    //         currentGame = Cards.REMOVE_ONE_UNFITTING_CARD.use({
    //             currentGame,
    //             socket,
    //             move
    //         })
    //         currentGame = Cards.REMOVE_ONE_UNFITTING_CARD.use({
    //             currentGame,
    //             socket,
    //             move
    //         })
    //         return currentGame
    //     },
    //     doesMeetConditions: ({game}) => {
    //         return true
    //     }
    // },
    // BLOCK_CARD: {
    //     id: 'BLOCK_CARD',
    //     title: 'Block enemy cards for 2 turns.',
    //     description: `<span>
    //             <b>Blocks enemy cards for 2 turns.</b>
    //         </span>
    //         <span>
    //             You can't block an already blocked player.<u>don't</u> add up.<br>
    //             These values <u>don't</u> add up.
    //         </span>`,
    //     use: ({ currentGame, socket, move }) => {
    //         let enemySocket = currentGame.playerSockets.filter(e => {
    //             return e.socketId !== move.playerSocketId
    //         })[0].socketId
    //         if (currentGame.blockCounters[enemySocket] === 0)
    //             currentGame.blockCounters[enemySocket] = 2
    //         return currentGame
    //     },
    //     doesMeetConditions: ({game, player}) => {
    //         let enemySocket = game.playerSockets.filter(e => {
    //             return e.socketId !== player.socketId
    //         })[0].socketId
    //         if (game.blockCounters[enemySocket] === 0) return true
    //         return false
    //     }
    // },
    // IMMUNE_TO_BLOCK_CARD: {
    //     id: 'IMMUNE_TO_BLOCK_CARD',
    //     title: 'Immune to block.',
    //     description: `<span>
    //             <b>Immune to blocking cards for 2 turns.</b>
    //         </span>
    //         <span>
    //             These values <u>do</u> add up.
    //         </span>`,
    //     use: ({ currentGame, socket, move }) => {
    //         let mySocket = move.playerSocketId
    //         let blockCounters = currentGame.blockCounters[mySocket]
    //         currentGame.blockCounters[mySocket] = blockCounters - 2
    //         return currentGame
    //     },
    //     doesMeetConditions: ({game}) => {
    //         return true
    //     }
    // },
    LOOK_UP_CARD: {
        id: 'LOOK_UP_CARD',
        title: 'Look up enemy card',
        description:
            'You can look up one of the enemies cards only if they have any.',
        disabledText: '',
        use: ({ currentGame, socket, move }) => {
            return currentGame
        },
        doesMeetConditions: ({ game, player }) => {
            let enemySocket = game.playerSockets.filter(e => {
                return e.socketId !== player.socketId
            })[0].socketId
            if (game.cards[enemySocket].length === 0) return false
            return true
        }
    },
    SWAP_RANDOM_CARDS: {
        id: 'SWAP_RANDOM_CARDS',
        title: 'Swap with opponent.',
        description: 'Swap your card for a random opponents card.',
        disabledText:
            'You must have a card besides this one in the deck. Your opponent has to have at least 1 card.',
        use: ({ currentGame, socket, move }) => {
            let enemySocketId = getEnemySocketId(
                currentGame,
                move.playerSocketId
            )
            let myCards = currentGame.cards[move.playerSocketId]
            let enemyCards = currentGame.cards[enemySocketId]

            let myRandomIndex = Math.floor(Math.random() * myCards.length)
            let enemyRandomIndex = Math.floor(Math.random() * enemyCards.length)

            let randomMyCard = myCards[myRandomIndex]
            let randomEnemyCard = enemyCards[enemyRandomIndex]

            currentGame.cards[move.playerSocketId][
                myRandomIndex
            ] = randomEnemyCard
            currentGame.cards[enemySocketId][enemyRandomIndex] = randomMyCard
            return currentGame
        },
        doesMeetConditions: ({ game, player }) => {
            let cards = game.cards
            let mySocketId = player.socketId
            let myCards = cards[mySocketId]
            let enemySocketId = game.playerSockets.filter(x => {
                return x.socketId !== player.socketId
            })[0].socketId
            let enemyCards = cards[enemySocketId]
            if (enemyCards.length === 0) return false

            let doOtherCardsExist = myCards.some(c => {
                return c.id !== Cards.SWAP_RANDOM_CARDS.id
            })

            if (doOtherCardsExist === false) return false
            return true
        }
    }
    // RANDOMIZE_YOURSELF_CARD: {
    //     id: 'RANDOMIZE_YOURSELF_CARD',
    //     title: 'Randomize a card',
    //     description: 'A random card of yours gets changed.',
    //     use: ({ currentGame, socket, move }) => {
    //         let getRandomCard = (exception = null) => {
    //             let excluded = ['RANDOMIZE_YOURSELF_CARD', exception]
    //             let included = Object.values(Cards).filter(
    //                 card => !excluded.includes(card.id)
    //             )
    //             let randomIndex = Math.floor(Math.random() * included.length)
    //             return included[randomIndex]
    //         }
    //         currentGame.cards[move.playerSocketId].push(getRandomCard())
    //         return currentGame
    //     },
    //     doesMeetConditions: ({game}) => {
    //         return true
    //     }
    // },
    // RANDOMIZE_ENEMY_CARD: {
    //     id: 'RANDOMIZE_ENEMY_CARD',
    //     title: 'Randomize an enemies card',
    //     description: 'A random card of your opponent gets changed.',
    //     use: ({ currentGame, socket, move }) => {
    //         let enemySocket = currentGame.playerSockets.filter(e => {
    //             return e.socketId !== move.playerSocketId
    //         })[0].socketId

    //         let getRandomCard = (exception = null) => {
    //             let excluded = ['RANDOMIZE_YOURSELF_CARD', exception]
    //             let included = Object.values(Cards).filter(
    //                 card => !excluded.includes(card.id)
    //             )
    //             let randomIndex = Math.floor(Math.random() * included.length)
    //             return included[randomIndex]
    //         }
    //         let enemyCardAmount = currentGame.cards[enemySocket].length
    //         let randomIndex = Math.floor(Math.random() * enemyCardAmount)
    //         if (enemyCardAmount > 0) {
    //             currentGame.cards[enemySocket][randomIndex] = getRandomCard()
    //         }
    //         return currentGame
    //     },
    //     doesMeetConditions: ({game, player}) => {
    //         let enemySocketId = game.playerSockets.filter(x => {
    //             return x.socketId !== player.socketId
    //         })[0].socketId

    //         if (game.cards[enemySocketId].length === 0) {
    //             return false
    //         }
    //         return true
    //     }
    // }
}

const getEnemySocketId = (game, playerSocketId) => {
    return game.playerSockets.filter(e => {
        return e.socketId !== playerSocketId
    })[0].socketId
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
    let isAdditionalTurnGenerated = false
    for (let i = 0; i < amount; i++) {
        let card = getRandomCard()
        if (card.id === Cards.ADDITIONAL_TURN_CARD.id) {
            if (isAdditionalTurnGenerated) {
                i = i - 1
            } else {
                isAdditionalTurnGenerated = true
                result.push(card)
            }
        } else {
            result.push(card)
        }
    }
    return result
}

const resupplyCards = game => {
    let { cards } = game
    for (let i = 0; i < Object.keys(cards).length; i++) {
        let player = Object.keys(cards)[i]
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
