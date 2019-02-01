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
import { POPUP_GENERIC } from './Components/Popup/Types'

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
            score: null,
            player: null,
            socket: null,
            connectedPlayers: {},
            game: null,
            isMove: false,
            volumeSettings: {
                //todo get saved music volume
                musicVol: '5',
                soundVol: '5'
            }
        }
    }

    componentDidMount() {
        this.initializeSocket()
        console.log(this.state.volumeSettings)
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

    setTitle = ({ title = null, score = null }) => {
        if (title) {
            this.setState({ title: title })
        } else if (score) {
            this.setState({ score: score })
        }
    }

    addPopupHandler = ({
        title = null,
        content = null,
        invitationData = null,
        acceptHandler = null,
        type = POPUP_GENERIC
    }) => {
        this.popupsRef.current.addPopup({
            title,
            content,
            invitationData,
            acceptHandler,
            type
        })
    }

    setGame = ({ game }) => {
        console.log('Game started!')
        this.setState({ game }, this.props.history.push('/game'))
    }

    setMove = isMove => {
        this.setState({ isMove })
    }

    setSettings = ({ soundVol, musicVol }) => {
        this.setState({
            volumeSettings: { soundVol: soundVol, musicVol: musicVol }
        })
    }

    //todo give keys and enforce update
    //todo if on any page and without socket, go to main menu

    render() {
        return (
            <div className='container of-rows width-full height-full text-nunito '>
                <Header
                    volumeSettings={this.state.volumeSettings}
                    title={this.state.title}
                    score={this.state.score}
                />
                <div className='row height-full width-full bg-lightgrey'>
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
                        <Route
                            path='/options/'
                            render={() => (
                                <Options
                                    setTitle={this.setTitle}
                                    volumeSettings={this.state.volumeSettings}
                                    setSettings={this.setSettings}
                                />
                            )}
                        />
                        <Route
                            path='/credits'
                            setTitle={this.setTitle}
                            component={Credits}
                        />
                        <Route
                            path='/help'
                            setTitle={this.setTitle}
                            component={Help}
                        />
                        <Route
                            path='/browser'
                            render={() => (
                                <PlayersBrowser
                                    socket={this.state.socket}
                                    player={this.state.player}
                                    connectedPlayers={
                                        this.state.connectedPlayers
                                    }
                                    setTitle={this.setTitle}
                                    addPopup={this.addPopupHandler}
                                    setGame={this.setGame}
                                    setMove={this.setMove}
                                />
                            )}
                        />
                        <Route
                            path='/game'
                            render={() => (
                                <Game
                                    player={this.state.player}
                                    game={this.state.game}
                                    socket={this.state.socket}
                                    setTitle={this.setTitle}
                                    addPopup={this.addPopupHandler}
                                    setMove={this.setMove}
                                    isMove={this.state.isMove}
                                />
                            )}
                        />
                        {/*todo <Route component={NotFound} />*/}
                    </Switch>
                </div>
            </div>
        )
    }
}

export default withRouter(App)
