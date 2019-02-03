import React from 'react'
import './PlayersBrowser.css'
import Scrollbar from 'react-scrollbars-custom'
import {
    PLAYER_CONNECTED,
    INVITATION,
    INVITATION_ACCEPTED,
    GAME_STARTED
} from '../../Shared/Events'
import { POPUP_INVITATION } from '../Popup/Types'
import BrowserEntry from './BrowserEntry'

/**
 * Returns a player list without the current player.
 * @callback invitationHandler
 * @param {Object} player Current player.
 * @param {Object[]} connectedPlayers An array of all currently connected players.
 * @param {invitationHandler} invitationHandler Sending invitation to our back-end.
 */
const extractBrowserPlayers = ({
    player,
    connectedPlayers,
    invitationHandler
}) => {
    connectedPlayers = Object.assign({}, connectedPlayers)

    //* don't display the current player
    if (player) {
        delete connectedPlayers[player.nickname]
    }

    let result = []
    console.log(connectedPlayers)
    console.log(Object.values(connectedPlayers))
    Object.values(connectedPlayers).forEach(player => {
        let { isInGame } = player
        console.log(isInGame)
        if (isInGame === false) {
            result.push(
                <BrowserEntry
                    id={player.id}
                    socketId={player.socketId}
                    invitationHandler={invitationHandler}
                    nickname={player.nickname}
                    key={player.id}
                    index={Object.values(connectedPlayers).indexOf(player)}
                />
            )
        }
    })
    return result
}

//todo unmounted timer
class PlayersBrowser extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            playersInBrowser: extractBrowserPlayers({
                player: this.props.player,
                connectedPlayers: this.props.connectedPlayers,
                invitationHandler: this.invitationHandler
            })
        }
        this.initializeSocket()
    }

    invitationHandler = ({ id = null, socketId = null }) => {
        //Prevent players fron inviting themselves
        if (id === this.props.player.id) {
            this.props.addPopup({
                title: 'Error!',
                content: 'You cannot invite yourself.'
            })
            return
        }

        const { socket } = this.props

        socket.emit(INVITATION, { id, socketId })
    }

    initializeSocket = () => {
        const { socket } = this.props
        socket.on(PLAYER_CONNECTED, ({ connectedPlayers }) => {
            this.setState({
                playersInBrowser: extractBrowserPlayers({
                    player: this.props.player,
                    connectedPlayers,
                    invitationHandler: this.invitationHandler
                })
            })
        })

        const isMove = ({ game }) => {
            let nextPlayerIndex = game.nextPlayerIndex
            return (
                game.playerSockets[nextPlayerIndex].id === this.props.player.id
            )
        }

        socket.on(INVITATION, ({ nickname, socketId }) => {
            this.incomingInvitationHandler({ nickname, socketId })
        })
        socket.on(GAME_STARTED, ({ game }) => {
            this.props.setGame({ game })
            this.props.setMove(isMove({ game }))
        })
    }

    componentWillUnmount() {
        const { socket } = this.props
        socket.off(PLAYER_CONNECTED)
        socket.off(INVITATION)
        socket.off(GAME_STARTED)
    }

    invitationAcceptHandler = ({ to = null, fromSocketId = null }) => {
        const { socket } = this.props

        socket.emit(INVITATION_ACCEPTED, { fromSocketId, to })
    }

    incomingInvitationHandler = ({ nickname = null, socketId = null }) => {
        console.log(`Invitation from ${nickname} (${socketId})`)
        this.props.addPopup({
            content: `New invitation from ${nickname}`,
            type: POPUP_INVITATION,
            invitationData: {
                acceptHandler: () => {
                    this.invitationAcceptHandler({
                        to: this.props.player,
                        fromSocketId: socketId
                    })
                }
            }
        })
    }

    render() {
        return (
            <div className='players-browser container content-vcenter border-neon border-neon-orange'>
                <div className='players-browser-title bg-lightgrey width-full text-xlg text-center'>
                    <p>
                        {this.props.player && (
                            <span>
                                You are logged in as{' '}
                                <b>{this.props.player.nickname}</b>.
                            </span>
                        )}
                    </p>
                </div>
                <Scrollbar style={{ width: '100%', height: '100%' }}>
                    {this.state.playersInBrowser.map(entry => {
                        return entry
                    })}
                </Scrollbar>
            </div>
        )
    }
}

export default PlayersBrowser
