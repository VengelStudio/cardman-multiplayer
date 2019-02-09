const { isMove } = require('../../Shared/Functions')
const {
    POPUP_CONFIRMATION,
    POPUP_GENERIC
} = require('../../Components/Popup/Types')

const winHandler = ({
    type,
    setMove = null,
    setScore = null,
    setTitle = null,
    score = null,
    game = null,
    addPopup = null,
    winner = null,
    player = null
}) => {
    let returnState = null
    if (type === 'turn') {
        returnState = { gameFromProps: false, game }
        setMove(isMove({ game, player }))
    } else if (type === 'turn_tie') {
        returnState = { gameFromProps: false, game }
        setMove(isMove({ game, player }))
        addPopup({
            type: POPUP_GENERIC,
            popupData: {
                title: 'TIE',
                content: `Turn is tied. None of the players won.`
            }
        })
    } else if (type === 'game') {
        //* win
        returnState = { allowMove: false }
        addPopup({
            type: POPUP_CONFIRMATION,
            popupData: {
                title: 'GAME ENDED',
                content: `Player ${winner.nickname} has won the game.`,
                onConfirm: () => {
                    console.log('confirmed')
                }
            }
        })
    }
    setScore({
        player,
        game,
        setTitle,
        score
    })

    return returnState
}

module.exports = { winHandler }
