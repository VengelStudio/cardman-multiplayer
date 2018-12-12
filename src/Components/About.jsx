import React, { Component } from 'react'

class About extends Component {
  render () {
    return (
      <div className='brand-footer'>
        <div className='brand-content'>
          <div className='brand-element' id='brand-logo-bg'>
            <a className='brand-link' href='#'>
              <img src='./img/logo-small.png' />
            </a>
          </div>
          <div className='brand-element'>
            <a className='brand-link' href='#'>
              <i className='fas fa-globe' />
              <b> Vengel Studio</b>
            </a>
          </div>
          <div className='brand-element'>
            <a className='brand-link' href='https://github.com/VengelStudio'>
              <i class='fab fa-github' /> GitHub
            </a>
          </div>
          <div className='brand-element'>
            <a className='brand-link' href='#'>
              <i className='fas fa-at' /> E-mail
            </a>
          </div>
          <div className='brand-element'>Created by Vengel Studio. All rights reserved 2019.</div>
        </div>
        <div id='brand-logo'>
          <button id='brand-button'>
            <img src='./img/logo-small.png' />
          </button>
        </div>
      </div>
    )
  }
}

export default About
