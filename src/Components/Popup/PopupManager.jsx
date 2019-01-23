import React, { Component } from 'react'
import Popup from './Popup'
import { POPUP_GENERIC } from './Types'

class PopupManager extends Component {
    state = { popups: [], lastPopupId: 0 }

    addPopup = ({
        title = null,
        content = null,
        invitationData = null,
        acceptHandler = null,
        type = POPUP_GENERIC
    }) => {
        this.setState({
            popups: [
                ...this.state.popups,
                {
                    id: this.state.lastPopupId,
                    title,
                    content,
                    invitationData,
                    acceptHandler,
                    type
                }
            ]
        })
        this.setState(prevState => ({
            lastPopupId: prevState.lastPopupId + 1
        }))
    }

    popupCloseHandler = id => {
        let newPopups = this.state.popups.filter(popup => {
            return popup.id !== id
        })
        this.setState({ popups: newPopups })
    }

    render() {
        return (
            <React.Fragment>
                {this.state.popups &&
                    this.state.popups.map(e => {
                        return (
                            <Popup
                                title={e.title}
                                content={e.content}
                                key={e.id}
                                id={e.id}
                                type={e.type}
                                onClose={this.popupCloseHandler}
                                invitationData={e.invitationData}
                                acceptHandler={e.acceptHandler}
                            />
                        )
                    })}
            </React.Fragment>
        )
    }
}

export default PopupManager
