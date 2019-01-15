import React from 'react'
import './PlayersBrowser.css'
import Scrollbar from 'react-scrollbars-custom'
import {
  PLAYER_CONNECTED,
  INVITATION,
  INVITATION_ACCEPTED,
  GAME_STARTED
} from '../../Events'
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

  //! not sure if it's not a source of bugs
  if (player) delete connectedPlayers[player.nickname]

  let result = []
  for (let player in connectedPlayers) {
    let nickname = connectedPlayers[player].nickname
    let id = connectedPlayers[player].id
    let socketId = connectedPlayers[player].socketId
    result.push(
      <BrowserEntry
        id={id}
        socketId={socketId}
        invitationHandler={invitationHandler}
        nickname={nickname}
        key={player}
        index={Object.keys(connectedPlayers).indexOf(player)}
      />
    )
  }
  return result
}

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
    //Call when other players connect in order to update the player browser
    socket.on(PLAYER_CONNECTED, ({ connectedPlayers }) => {
      this.setState({
        playersInBrowser: extractBrowserPlayers({
          player: this.props.player,
          connectedPlayers,
          invitationHandler: this.invitationHandler
        })
      })
    })

    socket.on(INVITATION, ({ nickname, socketId }) => {
      this.incomingInvitationHandler({ nickname, socketId })
    })
    socket.on(GAME_STARTED, ({ game }) => {
      console.log(game)
      this.props.setGame({ game })
    })
  }

  invitationAcceptHandler = ({ to = null, fromSocketId = null }) => {
    const { socket } = this.props

    socket.emit(INVITATION_ACCEPTED, { fromSocketId, to })
  }

  incomingInvitationHandler = ({ nickname = null, socketId = null }) => {
    console.log(`Invitation from ${nickname} (${socketId})`)
    this.props.addPopup({
      content: `New invitation from ${nickname}`,
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
                You are logged in as <b>{this.props.player.nickname}</b>.
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
