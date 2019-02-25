import React from 'react'
import './App.css'

import Header from './Components/Header/Header'
import Popups from './Components/Popup/Popups'
import Game from './Components/Game/Game'
import Credits from './Components/Credits/Credits'
import PlayersBrowser from './Components/PlayersBrowser/PlayersBrowser'
import LoginPage from './Components/LoginPage/LoginPage'

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
            title: 'Cardman Multiplayer',
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
        this.setState({ socket })

        socket.on('connect', () => {
            console.log('Connected to server.')
        })

        socket.on('pong', ms => {
            if (ms > this.config.disconnectedTimeoutMs) {
                this.setState({ isDisconnected: true })
            } else {
                this.setState({ isDisconnected: false })
            }
        })

        let refreshingPlayersSockets = [
            PLAYER_CONNECTED,
            PLAYER_DISCONNECTED,
            REFRESH_PLAYERS
        ]

        refreshingPlayersSockets.forEach(s => {
            socket.on(s, ({ connectedPlayers }) => {
                console.log(s)
                this.setState({ connectedPlayers })
            })
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
                    onDecline: () => { }
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
            this.props.history.push('/browser')
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

    muteMusic = state => {
        this.setState({
            volumeSettings: { ...this.state.volumeSettings, muted: state }
        })
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
                    <Popups
                        newPopup={this.state.newPopup}
                        isDisconnected={this.state.isDisconnected}
                        soundVolume={this.state.volumeSettings.soundVol}
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
                            path='/credits'
                            setTitle={this.setTitle}
                            component={Credits}
                        />
                        <Route
                            path='/browser'
                            render={() => (
                                <PlayersBrowser
                                    player={this.state.player}
                                    setTitle={this.setTitle}
                                    addPopup={this.addPopup}
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
                                    soundVolume={
                                        this.state.volumeSettings.soundVol
                                    }
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
