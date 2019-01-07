import React from 'react'
import './PlayersBrowser.css'
import Scrollbar from 'react-scrollbars-custom'
import { PLAYER_CONNECTED, INVITATION } from '../../Events'
import BrowserEntry from './BrowserEntry'

class PlayersBrowser extends React.Component {
  constructor(props) {
    super(props)
    this.state = { playersInBrowser: this.props.playersInBrowser }
  }

  invitationHandler = ({ id = null, socketId = null }) => {
    //Prevent players fron inviting themselves
    if (id === this.state.player.id) {
      //!this.addPopup({ title: 'Error!', content: 'You cannot invite yourself.' })
      return
    }

    const { socket } = this.state
    socket.emit(INVITATION, { id, socketId })
    socket.on(INVITATION, () => {
      console.log('INVITEEEEED!')
    })
    //todo invitation socket
    this.props.history.push('/game')
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
  }
  componentWillMount() {
    this.initializeSocket()
    this.setState({ playersInBrowser: this.extractBrowserPlayers(this.props.connectedPlayers) })
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

export default PlayersBrowser
