import React, { Component } from 'react'
import './PlayersBrowser.css'
import { POPUP_GENERIC } from '../../Components/Popup/Types'

class BrowserEntry extends Component {
    state = {
        isButtonDisabled: false
    }

    componentDidMount() {
        this._isMounted = true
        this.setState({ isButtonDisabled: false })
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    componentDidUpdate() {
        if (this.state.isButtonDisabled === true) {
            setTimeout(() => {
                if (this._isMounted === true) {
                    this.setState({ isButtonDisabled: false })
                }
            }, 5000)
        }
    }

    clickHandler = event => {
        event.preventDefault()
        if (this.state.isButtonDisabled === true) {
            this.props.addPopup({
                type: POPUP_GENERIC,
                popupData: {
                    title: 'Error!',
                    content: '<p>You are inviting too fast. Wait 5 seconds</p>'
                }
            })
        } else {
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
