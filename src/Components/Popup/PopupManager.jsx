import React, { Component } from 'react'
import Popup from './Popup'

class PopupManager extends Component {
  state = { popups: [], lastPopupId: 0 }

  addPopup = ({ title = null, content = null, invitationData = null, acceptHandler = null }) => {
    this.setState({
      popups: [...this.state.popups, { id: this.state.lastPopupId, title, content, invitationData, acceptHandler }]
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
