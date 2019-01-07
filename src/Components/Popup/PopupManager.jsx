import React, { Component } from 'react'
import Popup from './Popup'

class PopupManager extends Component {
  state = { popups: [], lastPopupId: 0 }

  addPopup = ({ title = null, content = null, isInvitation = false, acceptHandler = null }) => {
    this.setState({
      popups: [...this.state.popups, { id: this.state.lastPopupId, title, content, isInvitation, acceptHandler }]
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
          this.state.popups.map(x => {
            return (
              <Popup
                title={x.title}
                content={x.content}
                key={x.id}
                id={x.id}
                onClose={this.popupCloseHandler}
                isInvitation={x.isInvitation}
                acceptHandler={x.acceptHandler}
              />
            )
          })}
      </React.Fragment>
    )
  }
}

export default PopupManager
