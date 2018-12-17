import React, { Component } from 'react';
import Logo from '../../Resources/Images/logo-small.png';
import './About.css';

class About extends Component {
  state = {
    expanded: false,
    width: '0%',
    visibility: 'hidden',
    fontSize: '0'
  };

  onButtonClick = () => {
    this.setState(
      state => ({
        expanded: !state.expanded
      }),
      () => {
        this.setState({ width: this.state.expanded ? '100%' : '0%' });
        this.setState({ visibility: this.state.expanded ? 'visible' : 'hidden' });
        this.setState({ fontSize: this.state.expanded ? '2vh' : '0' });
      }
    );
  };

  getStyle = () => {
    return {
      width: this.state.width,
      visibility: this.state.visibility,
      fontSize: this.state.fontSize
    };
  };

  getYear = () => {
    let today = new Date();
    return today.getFullYear();
  };

  render() {
    return (
      <div className='brand-footer'>
        <div style={this.getStyle()} className='brand-content'>
          <div className='brand-element badge-bg website'>
            <a className='brand-link' href='/'>
              <b>
                VengelStudio<small>.com</small>
              </b>
            </a>
          </div>
          <div className='brand-element badge-bg'>
            <a className='brand-link' href='https://github.com/VengelStudio'>
              <i className='fab fa-github' />
            </a>
          </div>
          <div className='brand-element badge-bg'>
            <a className='brand-link' href='mailto:vengelstudio@gmail.com'>
              <i className='fas fa-at' />
            </a>
          </div>
          <div className='brand-element'>
            <small>{`Created by Vengel Studio. All rights reserved ${this.getYear()}.`}</small>
          </div>
        </div>
        <div className='brand-logo'>
          <button onClick={this.onButtonClick} className='brand-button' />
          <img src={Logo} alt='Logo.' />
        </div>
      </div>
    );
  }
}

export default About;
