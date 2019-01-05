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
        className='play border-neon border-neon-lime'
      >
        Play
      </button>
    </div>
  )
}

class PlayersBrowser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    this.initializeSocket()
    this.setState({ playerList: this.getEntries(this.props.connectedPlayers) })
  }

  initializeSocket = () => {
    const { socket } = this.props
    /*socket.on('broadcast', connectedPlayers => {
      console.log(connectedPlayers)
    })*/
  }

  getEntries = players => {
    let result = []
    for (let index in players) {
      console.log(players[index])
      let nickname = players[index].nickname
      if (index % 2 === 0) {
        result.push(
          <BrowserEntry
            gameStartHandler={this.props.gameStartHandler}
            nickname={nickname}
            key={index}
            lightColor={true}
          />
        )
      } else {
        result.push(
          <BrowserEntry
            gameStartHandler={this.props.gameStartHandler}
            nickname={nickname}
            key={index}
            lightColor={false}
          />
        )
      }
    }
    return result
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
          {this.state.playerList.map(entry => {
            return entry
          })}
        </Scrollbar>
      </div>
    )
  }
}

export default PlayersBrowser
