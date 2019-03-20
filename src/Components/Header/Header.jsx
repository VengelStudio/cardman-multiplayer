import React, { Component } from 'react'
import HeaderBar from './HeaderBar'
import Settings from './Settings'
import { withRouter } from 'react-router-dom'
import './Header.css'

class Header extends Component {
    state = { volumeSettings: this.props.volumeSettings }
    static getDerivedStateFromProps(props, state) {
        if (props.location.pathname === '/game') {
            return {
                volumeSettings: { ...props.volumeSettings, musicVol: 0 }
            }
        }
        return { volumeSettings: props.volumeSettings }
    }

    render() {
        return (
            <div className='row header width-full semi-bold bg-dark color-lightblue padding-sm height-sm text-lg content-hcenter content-vcenter'>
                <Settings
                    volumeSettings={this.state.volumeSettings}
                    setSettings={this.props.setSettings}
                />
                <HeaderBar title={this.props.title} score={this.props.score} />
            </div>
        )
    }
}

export default withRouter(Header)
