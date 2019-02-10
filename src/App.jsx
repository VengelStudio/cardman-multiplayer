import React from 'react'
import './App.css'

import Header from './Components/Header/Header'
import PopupManager from './Components/Popup/Popups'
import Game from './Components/Game/Game'
import Credits from './Components/Menu/Credits/Credits'
import Help from './Components/Menu/Help/Help'
import Menu from './Components/Menu/Menu'
import PlayersBrowser from './Components/PlayersBrowser/PlayersBrowser'
import LoginPage from './Components/Menu/LoginPage/LoginPage'

import { POPUP_GENERIC, POPUP_INVITATION } from './Components/Popup/Types'

import io from 'socket.io-client'
import {
    PLAYER_CONNECTED,
    LOGOUT,
    PLAYER_DISCONNECTED,
    INVITATION,
    GAME_STARTED,
    REFRESH_PLAYERS,
    INVITATION_ACCEPTED
} from './Shared/Events'
import { isMove } from './Shared/Functions'

import { Route, withRouter, Switch } from 'react-router-dom'

import ReactAudioPlayer from 'react-audio-player'
import bgMusic from './Resources/Sounds/bg-lower.mp3'

const uuidv4 = require('uuid/v4')
const socketUrl = 'http://localhost:3231'
const { setScore } = require('./Shared/Functions')

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
                soundVol: 0.5,
                muted: false
            },
            isDisconnected: false
        }
    }

    config = {
        disconnectedTimeoutMs: 20,
        defaultVolumeSettings: {
            musicVol: 0.5,
            soundVol: 0.5
        }
    }

    isInCache = key => {
        return (
            localStorage.getItem(key) !== null &&
            localStorage.getItem(key) !== undefined
        )
    }

    componentDidUpdate() {
        if (this.props.location.pathname !== '/') {
            if (this.state.player === null) {
                this.props.history.push('/')
            }
        }
    }

    componentDidMount() {
        if (this.isInCache('cachedVolumeSettings')) {
            let cachedVolumeSettings = JSON.parse(
                localStorage.getItem('cachedVolumeSettings')
            )
            this.setState({
                volumeSettings: {
                    musicVol: cachedVolumeSettings.musicVol,
                    soundVol: cachedVolumeSettings.soundVol
                }
            })
        } else {
            let cachedVolumeSettings = {
                musicVol: this.config.defaultVolumeSettings.musicVol,
                soundVol: this.config.defaultVolumeSettings.soundVol
            }
            localStorage.setItem(
                'cachedVolumeSettings',
                JSON.stringify(cachedVolumeSettings)
            )
        }

        this.initializeSocket()
    }

    invitationHandler = ({ id = null, socketId = null }) => {
        //Prevent players fron inviting themselves
        if (id === this.state.player.id) {
            this.addPopup({
                title: 'Error!',
                content: 'You cannot invite yourself.'
            })
        } else {
            const { socket } = this.state
            socket.emit(INVITATION, { id, socketId })
        }
    }

    initializeSocket = () => {
        const socket = io(socketUrl)
        socket.on('connect', () => {
            console.log('Connected to server.')
        })
        this.setState({ socket })

        socket.on('pong', ms => {
            if (ms > this.config.disconnectedTimeoutMs) {
                this.setState({ isDisconnected: true })
            } else {
                this.setState({ isDisconnected: false })
            }
        })

        socket.on(PLAYER_CONNECTED, ({ connectedPlayers }) => {
            console.log('Player connected!')
            this.setState({ connectedPlayers })
        })

        socket.on(PLAYER_DISCONNECTED, ({ connectedPlayers }) => {
            this.setState({ connectedPlayers })
            console.log('Player disconnected!')
        })

        socket.on(REFRESH_PLAYERS, ({ connectedPlayers }) => {
            console.log('Refreshing players!')
            this.setState({ connectedPlayers })
        })

        socket.on(INVITATION, ({ nickname, socketId }) => {
            const { socket } = this.state
            this.addPopup({
                type: POPUP_INVITATION,
                popupData: {
                    nickname,
                    onAccept: () => {
                        socket.emit(INVITATION_ACCEPTED, {
                            fromSocketId: socketId,
                            to: this.state.player
                        })
                    },
                    onDecline: () => {
                        console.log('declined, todo here')
                    }
                }
            })
        })

        socket.on(GAME_STARTED, ({ game }) => {
            this.setGame({ game })
            this.setMove(isMove({ game, player: this.state.player }))
            setScore({
                player: this.state.player,
                game,
                setTitle: this.setTitle
            })
        })
    }

    loginPlayer = player => {
        const { socket } = this.state
        //Sending login socket with freshly generated, previosly verified player
        socket.emit(PLAYER_CONNECTED, player)
        this.setState({ player })

        //Wait for server response, then get the player list
        socket.on(PLAYER_CONNECTED, ({ connectedPlayers }) => {
            this.setState({ connectedPlayers })
            console.log('PLAYER CONNECTED')
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
        this.setState({ title: title })
        this.setState({ score: score })
    }

    setGame = ({ game }) => {
        this.setState({ game }, this.props.history.push('/game'))
    }

    setMove = isMove => {
        this.setState({ isMove })
    }
    muteMusic = state => {
        this.setState({
            volumeSettings: { ...this.state.volumeSettings, muted: state }
        })
    }

    setSettings = ({ soundVol, musicVol }) => {
        this.setState({
            volumeSettings: { soundVol: soundVol, musicVol: musicVol }
        })
        let cachedVolumeSettings = { musicVol: musicVol, soundVol: soundVol }
        localStorage.setItem(
            'cachedVolumeSettings',
            JSON.stringify(cachedVolumeSettings)
        )
    }

    addPopup = ({ type = POPUP_GENERIC, popupData }) => {
        this.setState({
            newPopup: { type, popupData: { ...popupData, id: uuidv4() } }
        })
    }

    render() {
        return (
            <div className='container of-rows width-full height-full text-nunito '>
                <Header
                    volumeSettings={this.state.volumeSettings}
                    title={this.state.title}
                    score={this.state.score}
                    setSettings={this.setSettings}
                />
                <ReactAudioPlayer
                    src={bgMusic}
                    autoPlay
                    volume={this.state.volumeSettings.musicVol}
                    loop={true}
                    muted={this.state.volumeSettings.muted}
                />
                <div className='row height-full width-full bg-lightgrey'>
                    <PopupManager
                        newPopup={this.state.newPopup}
                        isDisconnected={this.state.isDisconnected}
                    />
                    <Switch>
                        <Route exact path='/'>
                            <LoginPage
                                socket={this.state.socket}
                                loginPlayer={this.loginPlayer}
                                setTitle={this.setTitle}
                                addPopup={this.addPopup}
                            />
                        </Route>
                        <Route
                            path='/menu'
                            render={() => <Menu setTitle={this.setTitle} />}
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
                                    player={this.state.player}
                                    setTitle={this.setTitle}
                                    invitationHandler={this.invitationHandler}
                                    connectedPlayers={
                                        this.state.connectedPlayers
                                    }
                                />
                            )}
                        />
                        <Route
                            path='/game'
                            render={() => (
                                <Game
                                    player={this.state.player}
                                    game={this.state.game}
                                    muteMusic={this.muteMusic}
                                    socket={this.state.socket}
                                    setTitle={this.setTitle}
                                    addPopup={this.addPopup}
                                    setMove={this.setMove}
                                    isMove={this.state.isMove}
                                />
                            )}
                        />
                    </Switch>
                </div>
            </div>
        )
    }
}

export default withRouter(App)
