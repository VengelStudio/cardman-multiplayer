const { isMove } = require('../../Shared/Functions')
const {
    POPUP_GAME_END,
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
            title: 'TIE',
            type: POPUP_GENERIC,
            content: `Turn is tied. None of the players won.`
        })
    } else if (type === 'game') {
        //* win
        //todo if win === true disable any interactions
        returnState = { allowMove: false }
        addPopup({
            title: 'WINNER',
            type: POPUP_GAME_END,
            content: `winner: ${winner.nickname}`
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
