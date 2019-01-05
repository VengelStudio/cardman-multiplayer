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
import { PLAYER_CONNECTED, LOGOUT, GET_PLAYERLIST } from './Events'
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
      connectedPlayers: []
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
          setPlayer={this.setPlayer}
        />
      )
    })
  }

  initializeSocket = () => {
    const socket = io(socketUrl)
    socket.on('connect', () => {
      console.log('Connected!')
    })
    this.setState({ socket }, this.initializeApp(socket))
  }

  playerConnectedHandler = list => {
    console.log(list)
  }

  setPlayer = player => {
    const { socket } = this.state
    socket.emit(PLAYER_CONNECTED, player)
    this.setState({ player })

    socket.emit(GET_PLAYERLIST, {}, ({ connectedPlayers }) => {
      console.log('Got player list: ', connectedPlayers)
      this.setState({ connectedPlayers })
    })
  }

  logout = () => {
    const { socket } = this.state
    socket.emit(LOGOUT)
    this.setState({ user: null })
  }

  addPopup = content => {
    this.setState({
      popups: [...this.state.popups, { id: this.state.lastPopupId, content: content }]
    })
    this.setState((prevState, props) => {
      lastPopupId: prevState.lastPopupId++
    })
  }

  menuPlayHandler = nickname => {
    this.setState({ nickname: nickname }, () => {
      this.setState({ title: 'Players browser' }, () => {
        this.setState({
          openedComponent: (
            <PlayersBrowser
              socket={this.state.socket}
              player={this.state.player}
              gameStartHandler={this.gameStartHandler}
              connectedPlayers={this.state.connectedPlayers}
            />
          )
        })
      })
    })
  }

  gameStartHandler = () => {
    this.setState({ openedComponent: <Game /> })
  }

  optionsStartHandler = () => {
    this.setState({ title: 'Options' }, () => {
      this.setState({ openedComponent: <Options /> })
    })
  }
  creditsStartHandler = () => {
    this.setState({ title: 'Credits' }, () => {
      this.setState({ openedComponent: <Credits /> })
    })
  }

  onPopupClose = id => {
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
              return <Popup title={x.title} content={x.content} key={x.id} id={x.id} onClose={this.onPopupClose} />
            })}
          {this.state.openedComponent && this.state.openedComponent}
        </div>
        <About />
      </div>
    )
  }
}

export default App
