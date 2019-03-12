import React, { Component } from 'react'
import './LoginPage.css'
import { VERIFY_USERNAME } from '../../Shared/Events'
import GenericModal from '../Popup/Popups/GenericModal'

class LoginPage extends Component {
    inputRef = React.createRef()
    state = {
        isNameLengthOpen: false,
        isNameSpaceOpen: false,
        isNameTakenOpen: false
    }

    componentDidMount() {
        this.props.setTitle({ title: 'Login page' })
    }

    loginHandler = () => {
        let { value } = this.inputRef.current
        const { socket } = this.props
        if (value.length <= 1) {
            this.setState({ isNameLengthOpen: true })
            return
        } else if (value.includes(' ')) {
            this.setState({ isNameSpaceOpen: true })
            return
        }
        socket.emit(VERIFY_USERNAME, value, ({ player, isTaken }) => {
            if (isTaken) {
                this.setState({ isNameTakenOpen: true })
            } else {
                this.props.loginPlayer(player)
            }
        })
    }

    submitOnEnter = key => {
        if (key.which === 13) {
            this.loginHandler()
        }
    }

    render() {
        let { volumeSettings } = this.props
        return (
            <div className='login-page-content'>
                {this.state.isNameLengthOpen && (
                    <GenericModal
                        title='Error!'
                        content='Your nickname has to be longer.'
                        onClose={() => {
                            this.setState({ isNameLengthOpen: false })
                        }}
                        soundVolume={volumeSettings.soundVol}
                    />
                )}
                {this.state.isNameSpaceOpen && (
                    <GenericModal
                        title='Error!'
                        content='Your nickname cannot have spaces.'
                        onClose={() => {
                            this.setState({ isNameLengthOpen: false })
                        }}
                        soundVolume={volumeSettings.soundVol}
                    />
                )}
                {this.state.isNameTakenOpen && (
                    <GenericModal
                        title='Error!'
                        content='This nickname is taken.'
                        onClose={() => {
                            this.setState({ isNameTakenOpen: false })
                        }}
                        soundVolume={volumeSettings.soundVol}
                    />
                )}

                <div className='infoNickname border-neon border-neon-violet'>
                    <p>Please enter your nickname</p>
                </div>
                <div className='nickname-input'>
                    <input
                        ref={this.inputRef}
                        type='text'
                        maxLength='15'
                        className='inputNickname border-neon border-neon-red'
                        onKeyDown={this.submitOnEnter}
                    />
                    <button
                        className='button-pointer border-neon border-neon-orange'
                        onClick={this.loginHandler}
                    >
                        SUBMIT
                    </button>
                </div>
            </div>
        )
    }
}

export default LoginPage
