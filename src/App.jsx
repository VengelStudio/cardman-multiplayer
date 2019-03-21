import React from 'react'
import './App.css'

import Header from './Components/Header/Header'
import Game from './Components/Game/Game'
import PlayersBrowser from './Components/PlayersBrowser/PlayersBrowser'
import LoginPage from './Components/LoginPage/LoginPage'

import io from 'socket.io-client'
import {
    PLAYER_CONNECTED,
    LOGOUT,
    PLAYER_DISCONNECTED,
    INVITATION,
    GAME_STARTED,
    REFRESH_PLAYERS,
    INVITATION_ACCEPTED,
    GAME_CREATED
} from './Shared/Events'
import { isMove } from './Shared/Functions'

import { Route, withRouter, Switch } from 'react-router-dom'

import ReactAudioPlayer from 'react-audio-player'
import bgMusic from './Resources/Sounds/bg-lower.mp3'
import Walkthrough from './Components/Game/Walkthrough'

import InvitationModal from './Components/Modals/InvitationModal'
import DisconnectedModal from './Components/Modals/DisconnectedModal'

// const socketUrl =
//     process.env.REACT_APP_STAGE.trim() === 'dev'
//         ? 'localhost:3231'
//         : 'ws://cardman-multiplayer.herokuapp.com:80'

let socketUrl = 'ws://cardman-multiplayer.herokuapp.com:80'
if (process.env.REACT_APP_STAGE) {
    if (process.env.REACT_APP_STAGE.trim() === 'dev')
        socketUrl = 'localhost:3231'
}
const { setScore } = require('./Shared/Functions')

class Logo extends React.Component {
    state = { display: true }
    componentDidMount() {
        setTimeout(() => {
            this.setState({ display: false })
        }, 2500)
    }
    render() {
        if (this.state.display) {
            return (
                <React.Fragment>
                    <div className='intro-logo'>
                        <div className='text-nunito intro-1'>Cardman&nbsp;</div>
                        <div className='text-nunito intro-2'>Multiplayer</div>
                    </div>
                </React.Fragment>
            )
        }
        return null
    }
}

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
            isDisconnected: false,
            gameId: null,
            isInvitationModal: false,
            invitationNickname: null,
            onInvitationAccept: null
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

    componentWillUnmount() {
        this.logoutPlayer()
    }

    invitationHandler = ({ id = null, socketId = null }) => {
        //Prevent players from inviting themselves
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
                this.setState({ connectedPlayers })
            })
        })

        socket.on(INVITATION, ({ nickname, socketId }) => {
            const { socket } = this.state
            this.setState({
                isInvitationModal: true,
                invitationNickname: nickname,
                onInvitationAccept: () => {
                    this.setState({ isInvitationModal: false }, () => {
                        socket.emit(INVITATION_ACCEPTED, {
                            fromSocketId: socketId,
                            to: this.state.player
                        })
                    })
                }
            })
        })

        socket.on(GAME_CREATED, ({ gameId }) => {
            this.setState({ gameId }, () => {
                this.props.history.push('/walkthrough')
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
        if (this.props.location.pathname === '/game') {
            musicVol = 0
        }
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

    render() {
        const {
            socket,
            player,
            game,
            gameId,
            isMove,
            connectedPlayers
        } = this.state
        const {
            volumeSettings,
            isInvitationModal,
            invitationNickname,
            onInvitationAccept,
            title,
            score,
            isDisconnected
        } = this.state
        return (
            <div className='container of-rows width-full height-full text-nunito '>
                {isInvitationModal && (
                    <InvitationModal
                        nickname={invitationNickname}
                        onAccept={onInvitationAccept}
                        onClose={() =>
                            this.setState({ isInvitationModal: false })
                        }
                        soundVolume={volumeSettings.soundVol}
                    />
                )}
                {isDisconnected && (
                    <DisconnectedModal soundVolume={volumeSettings.soundVol} />
                )}
                <Logo />
                <Header
                    volumeSettings={volumeSettings}
                    title={title}
                    score={score}
                    setSettings={this.setSettings}
                />
                <ReactAudioPlayer
                    src={bgMusic}
                    autoPlay
                    volume={volumeSettings.musicVol}
                    loop={true}
                    muted={volumeSettings.muted}
                />
                <div className='row height-full width-full bg-lightgrey'>
                    <Switch>
                        <Route exact path='/'>
                            <LoginPage
                                socket={socket}
                                loginPlayer={this.loginPlayer}
                                setTitle={this.setTitle}
                                volumeSettings={this.state.volumeSettings}
                            />
                        </Route>
                        <Route
                            path='/browser'
                            render={() => (
                                <PlayersBrowser
                                    player={player}
                                    setTitle={this.setTitle}
                                    invitationHandler={this.invitationHandler}
                                    connectedPlayers={connectedPlayers}
                                    volumeSettings={volumeSettings}
                                />
                            )}
                        />
                        <Route
                            path='/walkthrough'
                            render={() => (
                                <Walkthrough
                                    player={player}
                                    setTitle={this.setTitle}
                                    gameId={gameId}
                                    muteMusic={this.muteMusic}
                                    socket={socket}
                                    soundVolume={volumeSettings.soundVol}
                                />
                            )}
                        />
                        <Route
                            path='/game'
                            render={() => (
                                <Game
                                    player={player}
                                    game={game}
                                    muteMusic={this.muteMusic}
                                    socket={socket}
                                    setTitle={this.setTitle}
                                    setMove={this.setMove}
                                    isMove={isMove}
                                    volumeSettings={volumeSettings}
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
