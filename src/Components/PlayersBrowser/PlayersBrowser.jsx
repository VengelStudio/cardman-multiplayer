import React from 'react'
import './PlayersBrowser.css'
import Scrollbar from 'react-scrollbars-custom'
import { extractBrowserPlayers } from './Functions'
import PropTypes from 'prop-types'

class PlayersBrowser extends React.Component {
    state = {
        connectedPlayers: this.props.connectedPlayers,
        playersInBrowser: extractBrowserPlayers({
            player: this.props.player,
            connectedPlayers: this.props.connectedPlayers,
            invitationHandler: this.props.invitationHandler,
            volumeSettings: this.props.volumeSettings
        }),
        searchedPlayer: null
    }

    componentDidMount() {
        this.props.setTitle({ title: 'Players browser' })
    }

    static getDerivedStateFromProps(props, state) {
        if (state.connectedPlayers !== props.connectedPlayers) {
            return {
                playersInBrowser: extractBrowserPlayers({
                    player: props.player,
                    connectedPlayers: props.connectedPlayers,
                    invitationHandler: props.invitationHandler,
                    volumeSettings: props.volumeSettings
                }),
                connectedPlayers: props.connectedPlayers
            }
        }
        return null
    }

    searchPlayer = e => {
        let input = e.target.value
        if (input === '') {
            this.setState({ searchedPlayer: null })
        } else {
            let players = Object.keys(this.props.connectedPlayers)
            players = players.filter(
                item => item !== this.props.player.nickname
            )
            for (let i = 0; i < players.length; i++) {
                if (players[i].toLowerCase().includes(input.toLowerCase())) {
                    this.setState({
                        searchedPlayer: this.props.connectedPlayers[players[i]]
                    })
                }
            }
        }
    }

    SearchedPlayer = () => {
        return extractBrowserPlayers({
            player: this.props.player,
            connectedPlayers: [this.state.searchedPlayer],
            invitationHandler: this.props.invitationHandler,
            volumeSettings: this.props.volumeSettings
        })
    }

    render() {
        let { player } = this.props
        let { searchedPlayer, playersInBrowser } = this.state
        return (
            <div className='players-browser container content-vcenter border-neon border-neon-orange'>
                <div className='players-browser-title bg-lightgrey width-full text-xlg text-center'>
                    <p>
                        {player && (
                            <span>
                                You are logged in as <b>{player.nickname}</b>.
                            </span>
                        )}
                    </p>
                </div>
                <div className='search-player'>
                    <input
                        placeholder='Search player'
                        onChange={this.searchPlayer}
                        className='border-neon border-neon-blue'
                    />
                </div>
                <Scrollbar style={{ width: '100%', height: '100%' }}>
                    {!searchedPlayer ? (
                        playersInBrowser.map(entry => {
                            return entry
                        })
                    ) : (
                        <this.SearchedPlayer />
                    )}
                </Scrollbar>
            </div>
        )
    }
}

PlayersBrowser.propTypes = {
    connectedPlayers: PropTypes.object.isRequired,
    invitationHandler: PropTypes.func.isRequired,
    player: PropTypes.object,
    playersInBrowser: PropTypes.array,
    setTitle: PropTypes.func.isRequired
}

export default PlayersBrowser
