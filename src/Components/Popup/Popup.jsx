import React, { Component } from 'react'
import './Popup.css'

class Popup extends Component {
  constructor(props) {
    super(props)
    this.bRadius = '0.5vw'
    this.roundedBottomStyle = { borderBottomLeftRadius: this.bRadius, borderBottomRightRadius: this.bRadius }
    this.roundedTopStyle = {
      borderTopLeftRadius: this.bRadius,
      borderTopRightRadius: this.bRadius
    }
    this.popupStyle = {
      ...this.roundedTopStyle,
      ...this.roundedBottomStyle
    }
  }

  acceptHandler = () => {
    this.props.invitationData.acceptHandler()
    this.closeHandler()
  }

  closeHandler = () => {
    this.props.onClose(this.props.id)
  }

  render() {
    return (
      <div
        style={this.popupStyle}
        className='border-neon border-neon-red container of-rows text-nunito bg-khaki popup center-absolute-both d-block p-absolute popup-upper-round popup-bottom-round'
      >
        {!this.props.invitationData && (
          <div
            style={this.roundedTopStyle}
            className='padding-sm popup-title row width-auto semi-bold text-lg color-light text-center'
          >
            <span dangerouslySetInnerHTML={{ __html: this.props.title }} />
            <button onClick={this.closeHandler} className='btn-popup-close'>
              <span className='fas margin-auto d-block fa-window-close' />
            </button>
          </div>
        )}
        <div
          className='row width-full height-full popup-content padding-sm text-md'
          dangerouslySetInnerHTML={{ __html: this.props.content }}
        />
        {this.props.invitationData && (
          <div className='popup-buttons'>
            <button onClick={this.acceptHandler} className='border-neon border-neon-lime'>
              Accept
            </button>
            <button onClick={this.closeHandler} className='border-neon border-neon-orange'>
              Decline
            </button>
          </div>
        )}
      </div>
    )
  }
}

export default Popup
