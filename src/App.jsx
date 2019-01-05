import React from 'react'
import './App.css'

import Header from './Components/Header/Header'
import About from './Components/About/About'
import Popup from './Components/Popup/Popup'
import Options from './Components/Menu/Options/Options'
import Game from './Components/Game/Game'
import Credits from './Components/Menu/Credits/Credits'
import Menu from './Components/Menu/Menu'
import PlayersBrowser from './Components/PlayersBrowser/PlayersBrowser'

import io from 'socket.io-client'
import { PLAYER_CONNECTED, LOGOUT, INVITATION } from './Events'
const socketUrl = 'http://localhost:3231'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: 'Hangman Multiplayer',
      player: null,
      socket: null,
      openedComponent: null,
      popups: [],
      lastPopupId: 0,
      connectedPlayers: {}
    }
  }

  componentWillMount() {
    this.initializeSocket()
  }

  initializeApp = socket => {
    this.setState({
      openedComponent: (
        <Menu
          addPopup={this.addPopup}
          menuPlayHandler={this.menuPlayHandler}
          optionsStartHandler={this.optionsStartHandler}
          creditsStartHandler={this.creditsStartHandler}
          socket={socket}
          loginPlayer={this.loginPlayer}
        />
      )
    })
  }

  initializeSocket = () => {
    const socket = io(socketUrl)
    socket.on('connect', () => {
      console.log('Connected to server.')
    })
    this.setState({ socket }, this.initializeApp(socket))
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
    })
  }

  logoutPlayer = () => {
    //Sending logout socket and setting user to player, thus hiding all the functionalities
    const { socket } = this.state
    socket.emit(LOGOUT)
    this.setState({ player: null })
  }

  menuPlayHandler = () => {
    this.setState({ title: 'Players browser' }, () => {
      this.setState({
        openedComponent: (
          <PlayersBrowser
            socket={this.state.socket}
            player={this.state.player}
            invitationHandler={this.invitationHandler}
            connectedPlayers={this.state.connectedPlayers}
          />
        )
      })
    })
  }

  invitationHandler = ({ id = null, socketId = null }) => {
    //Prevent players fron inviting themselves
    if (id === this.state.player.id) {
      this.addPopup({ title: 'Error!', content: 'You cannot invite yourself.' })
      return
    }

    const { socket } = this.state
    socket.emit(INVITATION, { id, socketId })
    socket.on(INVITATION, () => {
      console.log('INVITEEEEED!')
    })
    //todo invitation socket
    this.setState({ openedComponent: <Game /> })
  }

  optionsViewHandler = () => {
    this.setState({ title: 'Options' }, () => {
      this.setState({ openedComponent: <Options /> })
    })
  }

  creditsViewHandler = () => {
    this.setState({ title: 'Credits' }, () => {
      this.setState({ openedComponent: <Credits /> })
    })
  }

  addPopup = ({ title = null, content = null }) => {
    this.setState({
      popups: [...this.state.popups, { id: this.state.lastPopupId, title: title, content: content }]
    })
    this.setState(prevState => ({
      lastPopupId: prevState.lastPopupId + 1
    }))
  }

  popupCloseHandler = id => {
    let newPopups = this.state.popups.filter(popup => {
      return popup.id !== id
    })
    this.setState({ popups: newPopups })
  }

  render() {
    return (
      <div className='container of-rows width-full height-full text-nunito '>
        <Header title={this.state.title} />
        <div className='row width-full height-full bg-lightgrey'>
          {this.state.popups &&
            this.state.popups.map(x => {
              return <Popup title={x.title} content={x.content} key={x.id} id={x.id} onClose={this.popupCloseHandler} />
            })}
          {this.state.openedComponent && this.state.openedComponent}
        </div>
        <About />
      </div>
    )
  }
}

export default App
