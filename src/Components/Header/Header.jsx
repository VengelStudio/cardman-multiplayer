import React, { Component } from 'react'
import './Header.css'
import { GoChevronLeft } from 'react-icons/go'
import { IconContext } from 'react-icons'
import { Route, withRouter } from 'react-router-dom'

let BackButton = props => {
  return (
    <button
      onClick={() => {
        props.history.goBack()
      }}
      className='back-button'
    >
      <IconContext.Provider value={{ color: 'whitesmoke', className: 'back-button-icon' }}>
        <GoChevronLeft />
      </IconContext.Provider>
    </button>
  )
}

class Header extends Component {
  render() {
    return (
      <div className='row header width-full semi-bold bg-dark color-lightblue padding-sm height-sm text-lg content-hcenter content-vcenter'>
        <div className='back-button-wrapper'>
          <Route path='(.{2,})' history={this.props} component={BackButton} />
        </div>
        <div className='column auto has-background-dark header'>
          <h1 className='title has-text-white-ter'>{this.props.title && this.props.title}</h1>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
