import React from 'react'
import './PlayersBrowser.css'
import Scrollbar from 'react-scrollbars-custom'
import { extractBrowserPlayers } from './Functions'

class PlayersBrowser extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            playersInBrowser: extractBrowserPlayers({
                player: this.props.player,
                connectedPlayers: this.props.connectedPlayers,
                invitationHandler: this.props.invitationHandler
            })
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (state.playersInBrowser !== props.playersInBrowser) {
            console.log('updating player list!')
            return {
                playersInBrowser: extractBrowserPlayers({
                    player: props.player,
                    connectedPlayers: props.connectedPlayers,
                    invitationHandler: props.invitationHandler
                })
            }
        }
        return null
    }

    render() {
        return (
            <div className='players-browser container content-vcenter border-neon border-neon-orange'>
                <div className='players-browser-title bg-lightgrey width-full text-xlg text-center'>
                    <p>
                        {this.props.player && (
                            <span>
                                You are logged in as{' '}
                                <b>{this.props.player.nickname}</b>.
                            </span>
                        )}
                    </p>
                </div>
                <Scrollbar style={{ width: '100%', height: '100%' }}>
                    {this.state.playersInBrowser.map(entry => {
                        return entry
                    })}
                </Scrollbar>
            </div>
        )
    }
}

export default PlayersBrowser
