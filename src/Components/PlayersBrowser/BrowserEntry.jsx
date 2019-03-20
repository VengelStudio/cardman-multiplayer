import React, { Component } from 'react'
import './PlayersBrowser.css'
import GenericModal from '../../Components/Modals/GenericModal'

class BrowserEntry extends Component {
    state = {
        isButtonDisabled: false,
        isTimeoutModal: false
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
            this.setState({ isTimeoutModal: true })
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
        let { isTimeoutModal } = this.state
        let { nickname, volumeSettings } = this.props
        return (
            <React.Fragment>
                {isTimeoutModal && (
                    <GenericModal
                        title='Error!'
                        content='You are inviting too fast. Wait 5 seconds.'
                        soundVolume={volumeSettings.soundVol}
                        onClose={() => {
                            this.setState({ isTimeoutModal: false })
                        }}
                    />
                )}
                <div className='browser-entry width-full'>
                    <span className='player-info'>
                        <span className='nickname'>{nickname}</span>
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
            </React.Fragment>
        )
    }
}

export default BrowserEntry
