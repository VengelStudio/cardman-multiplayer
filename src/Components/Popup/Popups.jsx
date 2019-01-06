import React, { Component } from 'react'
import Popup from './Popup'

class Popups extends Component {
  state = { popups: [], lastPopupId: 0 }

  addPopup = ({ title = null, content = null }) => {
    this.setState({
      popups: [...this.state.popups, { id: this.state.lastPopupId, title: title, content: content }]
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
            return <Popup title={x.title} content={x.content} key={x.id} id={x.id} onClose={this.popupCloseHandler} />
          })}
      </React.Fragment>
    )
  }
}

export default Popups
