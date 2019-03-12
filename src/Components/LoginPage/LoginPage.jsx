import React, { Component } from 'react'
import './LoginPage.css'
import GenericModal from '../Modals/GenericModal'
import { VERIFY_USER } from '../../Shared/Events'

class LoginPage extends Component {
    inputRef = React.createRef()
    state = {
        isNameLengthOpen: false,
        isNameSpaceOpen: false,
        isNameTakenOpen: false,
        isAlreadyLoggedInOpen: false
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
        socket.emit(VERIFY_USER, value, ({ player, isTaken, isIpFree }) => {
            if (!isIpFree) {
                this.setState({ isAlreadyLoggedInOpen: true })
            } else if (isTaken) {
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
                            this.setState({ isNameSpaceOpen: false })
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
                {this.state.isAlreadyLoggedInOpen && (
                    <GenericModal
                        title='Error!'
                        content='You are already logged in.'
                        onClose={() => {
                            this.setState({ isAlreadyLoggedInOpen: false })
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
                        placeholder='Your nickname...'
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
