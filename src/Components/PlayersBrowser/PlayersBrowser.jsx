import React from 'react'
import './PlayersBrowser.css'
import Scrollbar from 'react-scrollbars-custom'
import { PLAYER_CONNECTED, PLAYER_DISCONNECTED, LOGOUT } from '../../Events'

const BrowserEntry = props => {
  let classes = 'browser-entry width-full '
  if (props.lightColor === true) {
    classes += 'browser-entry-lightbg'
  } else if (props.lightColor === false) {
    classes += 'browser-entry-darkbg'
  }

  const handleGameStart = props => {
    props.gameStartHandler()
  }

  return (
    <div className={classes}>
      <span className='player-info'>
        <img className='country' src='https://www.countryflags.io/pl/flat/64.png' />
        <span className='nickname'>{props.nickname}</span>
      </span>
      <button
        onClick={e => {
          handleGameStart(props)
        }}
        className='button-pointer play border-neon border-neon-lime'
      >
        Play
      </button>
    </div>
  )
}

class PlayersBrowser extends React.Component {
  constructor(props) {
    super(props)
    this.state = { playersInBrowser: this.props.playersInBrowser }
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
          invitationHandler={this.props.invitationHandler}
          nickname={nickname}
          key={player}
          index={Object.keys(players).indexOf(player)}
        />
      )
    }
    return result
  }

  componentWillMount() {
    this.initializeSocket()
    this.setState({ playersInBrowser: this.extractBrowserPlayers(this.props.connectedPlayers) })
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
