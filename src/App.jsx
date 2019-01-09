import React from 'react'
import './App.css'

import Header from './Components/Header/Header'
import PopupManager from './Components/Popup/PopupManager'
import Options from './Components/Menu/Options/Options'
import Game from './Components/Game/Game'
import Credits from './Components/Menu/Credits/Credits'
import Help from './Components/Menu/Help/Help'
import Menu from './Components/Menu/Menu'
import PlayersBrowser from './Components/PlayersBrowser/PlayersBrowser'
import LoginPage from './Components/Menu/LoginPage/LoginPage'

import io from 'socket.io-client'
import { PLAYER_CONNECTED, LOGOUT } from './Events'

import { Route, withRouter, Switch } from 'react-router-dom'

const socketUrl = 'http://localhost:3231'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.popupsRef = React.createRef()
    this.state = {
      title: 'Hangman Multiplayer',
      player: null,
      socket: null,
      connectedPlayers: {}
    }
  }

  componentWillMount() {
    this.initializeSocket()
  }

  initializeSocket = () => {
    const socket = io(socketUrl)
    socket.on('connect', () => {
      console.log('Connected to server.')
    })
    this.setState({ socket })
  }

  loginPlayer = player => {
    const { socket } = this.state
    //Sending login socket with newly generated, previosly verified player
    socket.emit(PLAYER_CONNECTED, player)
    this.setState({ player })

    //Wait for server response, then get the player list
    socket.on(PLAYER_CONNECTED, ({ connectedPlayers }) => {
      console.log(player.nickname + ' just got initial player list:')
      console.log(connectedPlayers)
      this.setState({ connectedPlayers })
      this.props.history.push('/menu')
    })
  }

  logoutPlayer = () => {
    //Sending logout socket and setting user to player, thus hiding all the functionalities
    const { socket } = this.state
    socket.emit(LOGOUT)
    this.setState({ player: null })
  }

  setTitle = ({ title = null }) => {
    this.setState({ title })
  }

  addPopupHandler = ({ title = null, content = null, invitationData = null, acceptHandler = null }) => {
    this.popupsRef.current.addPopup({ title, content, invitationData, acceptHandler })
  }

  render() {
    return (
      <div className='container of-rows width-full height-full text-nunito '>
        <Header title={this.state.title} />
        <div className='row width-full height-full bg-lightgrey'>
          <PopupManager ref={this.popupsRef} />
          <Switch>
            <Route exact path='/'>
              <LoginPage
                socket={this.state.socket}
                loginPlayer={this.loginPlayer}
                setTitle={this.setTitle}
                addPopup={this.addPopupHandler}
              />
            </Route>
            <Route path='/menu' component={Menu} />
            <Route path='/options/' setTitle={this.setTitle} component={Options} />
            <Route path='/credits' setTitle={this.setTitle} component={Credits} />
            <Route path='/help' setTitle={this.setTitle} component={Help} />
            <Route
              path='/browser'
              render={() => (
                <PlayersBrowser
                  socket={this.state.socket}
                  player={this.state.player}
                  connectedPlayers={this.state.connectedPlayers}
                  setTitle={this.setTitle}
                  addPopup={this.addPopupHandler}
                />
              )}
            />
            <Route path='/game' component={Game} />
            {/*todo <Route component={NotFound} />*/}
          </Switch>
        </div>
      </div>
    )
  }
}

export default withRouter(App)
