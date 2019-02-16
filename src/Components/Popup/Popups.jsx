import React, { Component } from 'react'
import GenericPopup from './Popups/GenericPopup'
import ConfirmationPopup from './Popups/ConfirmationPopup'
import InvitationPopup from './Popups/InvitationPopup'
import DisconnectedPopup from './Popups/DisconnectedPopup'
import {
    // eslint-disable-next-line
    POPUP_GENERIC,
    // eslint-disable-next-line
    POPUP_CONFIRMATION,
    // eslint-disable-next-line
    POPUP_INVITATION,
    // eslint-disable-next-line
    POPUP_DISCONNECTED
} from './Types'
import './Popup.css'

class Popups extends Component {
    state = { popups: [], newPopup: null }

    static getDerivedStateFromProps(props, state) {
        if (state.newPopup !== props.newPopup) {
            if (props.newPopup)
                return {
                    newPopup: props.newPopup,
                    popups: [...state.popups, props.newPopup]
                }
        }
        return null
    }

    components = {
        POPUP_GENERIC: GenericPopup,
        POPUP_CONFIRMATION: ConfirmationPopup,
        POPUP_INVITATION: InvitationPopup,
        POPUP_DISCONNECTED: DisconnectedPopup
    }

    onClose = id => {
        let newPopups = this.state.popups.filter(popup => {
            return popup.popupData.id !== id
        })
        this.setState({ popups: newPopups })
    }

    Popup = ({ type, popupData }) => {
        let Component = this.components[type]
        return (
            <Component
                key={popupData.id}
                popupData={{ ...popupData, onClose: this.onClose }}
            />
        )
    }

    render() {
        let displayStyle = this.state.popups.length === 0 ? 'none' : 'flex'
        return (
            <div style={{ display: displayStyle }} className='popups-wrapper'>
                {this.props.isDisconnected === true ? (
                    <DisconnectedPopup />
                ) : null}
                {this.state.popups &&
                    this.state.popups.map(popup => {
                        return (
                            <this.Popup
                                key={popup.popupData.id}
                                type={popup.type}
                                popupData={popup.popupData}
                            />
                        )
                    })}
            </div>
        )
    }
}

export default Popups
