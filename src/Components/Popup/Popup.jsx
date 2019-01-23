import React, { Component } from 'react'
import './Popup.css'
import { POPUP_INVITATION, POPUP_GAME_END } from './Types'
import { withRouter } from 'react-router-dom'

class Popup extends Component {
    //todo popup type constants

    state = {
        type: this.props.type
    }

    bRadius = '0.5vw'
    roundedBottomStyle = {
        borderBottomLeftRadius: this.bRadius,
        borderBottomRightRadius: this.bRadius
    }

    roundedTopStyle = {
        borderTopLeftRadius: this.bRadius,
        borderTopRightRadius: this.bRadius
    }

    popupStyle = {
        ...this.roundedTopStyle,
        ...this.roundedBottomStyle
    }

    acceptButtonStyle = 'border-neon border-neon-lime'
    declineButtonStyle = 'border-neon border-neon-orange'
    closeButtonStyle = 'btn-popup-close'
    //prettier-ignore
    titleStyle = 'padding-sm popup-title row width-auto semi-bold text-lg color-light text-center'
    contentStyle = 'row width-full height-full popup-content padding-sm text-md'

    generateButton = ({ onClick, style, content = '' }) => {
        return (
            <button onClick={onClick} className={style}>
                {content}
            </button>
        )
    }

    onAcceptButton = () => {
        this.props.invitationData.acceptHandler()
        this.onCloseButton()
    }

    onGameEndButton = () => {
        this.props.history.push('/browser')
        this.onCloseButton()
    }

    onCloseButton = () => {
        this.props.onClose(this.props.id)
    }

    isInvitation = () => {
        this.setState({
            isInvitation: this.props.invitationData ? true : false
        })
    }

    PopupContent = () => {
        let content = []
        if (this.state.type !== POPUP_INVITATION) {
            content.push(
                <div
                    style={this.roundedTopStyle}
                    className={this.titleStyle}
                    key={0}
                >
                    <span>{this.props.title}</span>
                    {this.generateButton({
                        onClick: this.onCloseButton,
                        style: this.closeButtonStyle,
                        content: (
                            <span className='fas margin-auto d-block fa-window-close' />
                        )
                    })}
                </div>
            )
        }

        content.push(
            <div
                className={this.contentStyle}
                dangerouslySetInnerHTML={{ __html: this.props.content }}
                key={1}
            />
        )

        if (this.state.type === POPUP_GAME_END) {
            content.push(
                <div className='popup-buttons' key={2}>
                    {this.generateButton({
                        onClick: this.onGameEndButton,
                        style: this.acceptButtonStyle,
                        content: 'OK'
                    })}
                </div>
            )
        }

        if (this.state.type === POPUP_INVITATION) {
            content.push(
                <div className='popup-buttons' key={3}>
                    {this.generateButton({
                        onClick: this.onAcceptButton,
                        style: this.acceptButtonStyle,
                        content: 'Accept'
                    })}
                    {this.generateButton({
                        onClick: this.onCloseButton,
                        style: this.declineButtonStyle,
                        content: 'Decline'
                    })}
                </div>
            )
        }

        return (
            <React.Fragment>
                {content.map(el => {
                    return el
                })}
            </React.Fragment>
        )
    }

    render() {
        return (
            <div
                style={this.popupStyle}
                className='border-neon border-neon-red container of-rows text-nunito bg-khaki popup center-absolute-both d-block p-absolute popup-upper-round popup-bottom-round'
            >
                <this.PopupContent />
            </div>
        )
    }
}

export default withRouter(Popup)
