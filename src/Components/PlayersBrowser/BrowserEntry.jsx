import React, { Component } from 'react'
import './PlayersBrowser.css'
import { POPUP_GENERIC } from '../../Components/Popup/Types'

class BrowserEntry extends Component {
    state = {
        isButtonDisabled: false
    }
    componentDidUpdate() {
        if (this.state.isButtonDisabled === true) {
            setTimeout(() => this.setState({ isButtonDisabled: false }), 5000)
        }
    }
    clickHandler = (event) => {
        event.preventDefault()
        if (this.state.isButtonDisabled === true) {
            console.log("pipup")
            this.props.addPopup({
                type: POPUP_GENERIC,
                popupData: {
                    title: 'Error!',
                    content: '<p>You are inviting too fast. Wait 5 seconds</p>'
                }
            })
        }
        else {
            this.setState({
                isButtonDisabled: true
            })

            this.props.invitationHandler({
                id: this.props.id,
                socketId: this.props.socketId
            })
        }
    }

    render() {
        return (
            <div className='browser-entry width-full'>
                <span className='player-info'>
                    <span className='nickname'>{this.props.nickname}</span>
                </span>
                <button
                    id="inviteButton"
                    onClick={e => {
                        this.clickHandler(e)
                    }}
                    className='play border-neon border-neon-lime'
                >
                    Play
                </button>
            </div>
        )
    }
}

export default BrowserEntry
