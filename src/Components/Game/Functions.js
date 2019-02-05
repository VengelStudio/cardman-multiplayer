const { isMove } = require('../../Shared/Functions')
const {
    POPUP_GAME_END,
    POPUP_GENERIC
} = require('../../Components/Popup/Types')

const setScore = ({ player, game = null, score = null, setTitle }) => {
    let myNickname = player.nickname

    let me = null,
        enemy = null
    if (game !== null)
        me = game.playerSockets.filter(p => {
            return p.socketId === player.socketId
        })

    let myScore = 0,
        enemyScore = 0
    if (game !== null && score !== null) myScore = score[me[0].socketId]

    if (game !== null)
        enemy = game.playerSockets.filter(p => {
            return p.socketId !== player.socketId
        })

    if (game !== null && score !== null) enemyScore = score[enemy[0].socketId]

    if (game !== null) {
        let enemyNickname = enemy[0].nickname
        setTitle({
            score: {
                me: myNickname,
                myScore: myScore,
                enemy: enemyNickname,
                enemyScore: enemyScore
            }
        })
    }
}

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

module.exports = { setScore, winHandler }
