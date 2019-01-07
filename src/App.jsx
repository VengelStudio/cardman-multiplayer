import React from 'react'
import './App.css'

import Header from './Components/Header/Header'
import About from './Components/About/About'
import Popups from './Components/Popup/Popups'
import Options from './Components/Menu/Options/Options'
import Game from './Components/Game/Game'
import Credits from './Components/Menu/Credits/Credits'
import Help from './Components/Menu/Help/Help'
import Menu from './Components/Menu/Menu'
import PlayersBrowser from './Components/PlayersBrowser/PlayersBrowser'
import LoginPage from './Components/Menu/LoginPage/LoginPage'


import io from 'socket.io-client'
import { PLAYER_CONNECTED, LOGOUT, INVITATION } from './Events'

import { BrowserRouter as Router, Route, withRouter, Switch } from 'react-router-dom'

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
      console.log(player.nickname + ' just got initial player list: ' + connectedPlayers)
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

  render() {
    return (
      <div className='container of-rows width-full height-full text-nunito '>
        <Header title={this.state.title} />
        <div className='row width-full height-full bg-lightgrey'>
          <Popups ref={this.popupsRef} />
          <Switch>
            <Route exact path='/'>
              <LoginPage socket={this.state.socket} loginPlayer={this.loginPlayer} setTitle={this.setTitle} />
            </Route>
            <Route
              path='/menu'
              component={Menu}
              addPopup={this.addPopup}
              menuPlayHandler={this.menuPlayHandler}
              setTitle={this.setTitle}
              socket={this.state.socket}
              loginPlayer={this.loginPlayer}
            />
            <Route path='/options/' setTitle={this.setTitle} component={Options} />
            <Route path='/credits' setTitle={this.setTitle} component={Credits} />
            <Route path='/help' setTitle={this.setTitle} component={Help} />
            <Route
              path='/browser'
              component={PlayersBrowser}
              socket={this.state.socket}
              player={this.state.player}
              invitationHandler={this.invitationHandler}
              connectedPlayers={this.state.connectedPlayers}
              setTitle={this.setTitle}
            />
            <Route path='/game' component={Game} />
            {/*todo <Route component={NotFound} />*/}
          </Switch>
        </div>
        <About />
      </div>
    )
  }
}

export default withRouter(App)
