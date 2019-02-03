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
import { PLAYER_CONNECTED, LOGOUT } from './Shared/Events'

import { Route, withRouter, Switch } from 'react-router-dom'

import ReactAudioPlayer from 'react-audio-player'
import bgMusic from './Resources/Sounds/bg-lower.mp3'

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
                musicVol: 0.5,
                soundVol: 0.5
            }
        }
    }

    config = {
        disconnectedTimeoutMs: 5000,
        defaultVolumeSettings: {
            musicVol: 0.5,
            soundVol: 0.5
        }
    }

    isInCache = key => {
        console.log(localStorage)
        return (localStorage.getItem(key) !== null && localStorage.getItem(key) !== undefined)
    }

    componentDidMount() {
        if (this.isInCache("cachedVolumeSettings")) {
            let cachedVolumeSettings = JSON.parse(localStorage.getItem('cachedVolumeSettings'))
            this.setState({ volumeSettings: { musicVol: cachedVolumeSettings.musicVol, soundVol: cachedVolumeSettings.soundVol } })
        } else {
            let cachedVolumeSettings = { musicVol: this.config.defaultVolumeSettings.musicVol, soundVol: this.config.defaultVolumeSettings.soundVol }
            localStorage.setItem("cachedVolumeSettings", JSON.stringify(cachedVolumeSettings))
        }

        this.initializeSocket()
    }

    initializeSocket = () => {
        const socket = io(socketUrl)
        socket.on('connect', () => {
            console.log('Connected to server.')
        })
        this.setState({ socket })

        socket.on('pong', latency => {
            if (latency > this.config.disconnectedTimeoutMs) {
                //todo add popup
            }
        })
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
        let cachedVolumeSettings = { musicVol: musicVol, soundVol: soundVol }
        localStorage.setItem("cachedVolumeSettings", JSON.stringify(cachedVolumeSettings))

    }

    render() {
        return (
            <div className='container of-rows width-full height-full text-nunito '>
                <Header volumeSettings={this.state.volumeSettings} title={this.state.title} score={this.state.score} setSettings={this.setSettings} />
                <ReactAudioPlayer
                    src={bgMusic}
                    autoPlay
                    volume={this.state.volumeSettings.musicVol}
                    loop={true}
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
