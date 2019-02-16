const { isMove } = require('../../Shared/Functions')
const {
    POPUP_CONFIRMATION,
    POPUP_GENERIC
} = require('../../Components/Popup/Types')
const { Result } = require('../../Shared/Enums')

const winHandler = ({
    type,
    props,
    setScore = null,
    score = null,
    game = null,
    winner = null,
    returnToMenu = null
}) => {
    const { addPopup, setMove, setTitle, player, muteMusic } = props
    let returnState = null
    if (type === Result.TURN_WIN) {
        returnState = { gameFromProps: false, game }
        setMove(isMove({ game, player }))
    } else if (type === Result.TURN_TIE) {
        returnState = { gameFromProps: false, game }
        setMove(isMove({ game, player }))
        addPopup({
            type: POPUP_GENERIC,
            popupData: {
                title: 'TIE',
                content: `Turn is tied. None of the players won.`
            }
        })
    } else if (type === Result.GAME_WIN) {
        //* win
        returnState = { allowMove: false }
        addPopup({
            type: POPUP_CONFIRMATION,
            popupData: {
                title: 'GAME ENDED',
                content: `Player ${winner.nickname} has won the game.`,
                onConfirm: () => {
                    muteMusic(false)
                    returnToMenu()
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
