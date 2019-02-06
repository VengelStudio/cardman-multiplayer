import React, { Component } from 'react'
import Popup from './Popup'
import { POPUP_GENERIC } from './Types'

class PopupManager extends Component {
    state = { popups: [], lastPopupId: 0 }

    // isDisconnected

    // static getDerivedStateFromProps(props, current_state) {
    //     if (current_state.value !== props.value) {
    //       return {
    //         value: props.value,
    //         computed_prop: heavy_computation(props.value)
    //       }
    //     }
    //     return null
    //   }

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
                    this.state.popups.map(popup => {
                        return (
                            <Popup
                                title={popup.title}
                                content={popup.content}
                                key={popup.id}
                                id={popup.id}
                                type={popup.type}
                                onClose={this.popupCloseHandler}
                                invitationData={popup.invitationData}
                                acceptHandler={popup.acceptHandler}
                            />
                        )
                    })}
            </React.Fragment>
        )
    }
}

export default PopupManager
