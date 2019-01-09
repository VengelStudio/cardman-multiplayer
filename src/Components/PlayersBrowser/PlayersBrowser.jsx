import React from 'react'
import './PlayersBrowser.css'
import Scrollbar from 'react-scrollbars-custom'
import { PLAYER_CONNECTED, INVITATION, INVITATION_ACCEPTED, GAME_STARTED } from '../../Events'
import BrowserEntry from './BrowserEntry'
import { withRouter } from 'react-router-dom'

class PlayersBrowser extends React.Component {
  constructor(props) {
    super(props)
    this.state = { playersInBrowser: this.extractBrowserPlayers(this.props.connectedPlayers) }
    this.initializeSocket()
  }

  invitationHandler = ({ id = null, socketId = null }) => {
    console.log('Sending an invitation to player: ', id)
    //Prevent players fron inviting themselves
    if (id === this.props.player.id) {
      this.props.addPopup({ title: 'Error!', content: 'You cannot invite yourself.' })
      return
    }

    const { socket } = this.props

    socket.emit(INVITATION, { id, socketId })
  }

  extractBrowserPlayers = players => {
    //Exclude current player from the players list
    players = Object.assign({}, players)
    delete players[this.props.player.nickname]

    let result = []
    for (let player in players) {
      let nickname = players[player].nickname
      let id = players[player].id
      let socketId = players[player].socketId
      result.push(
        <BrowserEntry
          id={id}
          socketId={socketId}
          invitationHandler={this.invitationHandler}
          nickname={nickname}
          key={player}
          index={Object.keys(players).indexOf(player)}
        />
      )
    }
    return result
  }

  initializeSocket = () => {
    const { socket } = this.props
    //Call when other players connect in order to update the player browser
    socket.on(PLAYER_CONNECTED, ({ connectedPlayers }) => {
      this.setState({ playersInBrowser: this.extractBrowserPlayers(connectedPlayers) }, () => {
        console.log('Updated player list state: ', this.state.playersInBrowser)
      })
    })

    socket.on(INVITATION, ({ nickname, socketId }) => {
      this.incomingInvitationHandler({ nickname, socketId })
    })
    socket.on(GAME_STARTED, ({ message }) => {
      console.log(message)
      this.props.history.push('/game')
    })
  }

  invitationAcceptHandler = ({ to = null, fromSocketId = null }) => {
    const { socket } = this.props

    socket.emit(INVITATION_ACCEPTED, { fromSocketId, to })
  }

  incomingInvitationHandler = ({ nickname = null, socketId = null }) => {
    console.log(`Invitation from ${nickname} (${socketId})`)
    this.props.addPopup({
      content: `invitation from ${nickname}`, invitationData: {
        acceptHandler: () => {
          this.invitationAcceptHandler({ to: this.props.player, fromSocketId: socketId })
        }
      }
    })
  }

  render() {
    return (
      <div className='players-browser container content-vcenter border-neon border-neon-orange'>
        <div className='players-browser-title bg-lightgrey width-full text-xlg text-center'>
          <p>
            You are logged in as <b>{this.props.player.nickname}</b>.
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

export default withRouter(PlayersBrowser)
