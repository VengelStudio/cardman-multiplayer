import React, { Component } from 'react'
import '../Popup.css'

class GenericPopup extends Component {
    onClose = () => {
        this.props.popupData.onClose(this.props.popupData.id)
    }

    render() {
        return (
            <div className='generic-popup border-neon border-neon-red text-nunito'>
                <div className='generic-popup-title'>
                    <span>{this.props.popupData.title}</span>
                    <button onClick={this.onClose} className='btn-popup-close'>
                        <span className='fas margin-auto d-block fa-window-close' />
                    </button>
                </div>
                <div
                    className='generic-popup-content'
                    dangerouslySetInnerHTML={{
                        __html: this.props.popupData.content
                    }}
                />
            </div>
        )
    }
}

export default GenericPopup
