import React, { Component } from 'react'
import HeaderBar from './HeaderBar'
import Settings from './Settings'
import './Header.css'

class Header extends Component {
    render() {
        return (
            <div className='row header width-full semi-bold bg-dark color-lightblue padding-sm height-sm text-lg content-hcenter content-vcenter'>
                <Settings
                    volumeSettings={this.props.volumeSettings}
                    setSettings={this.props.setSettings}
                />
                <HeaderBar title={this.props.title} score={this.props.score} />
            </div>
        )
    }
}

export default Header
