import React, { Component } from 'react'
import './Menu.css'
import { withRouter } from 'react-router-dom'

class Menu extends Component {
    render() {
        return (
            <div className='menu'>
                <button
                    onClick={() => {
                        this.props.history.push('/browser')
                    }}
                    className='button-pointer border-neon border-neon-red'
                >
                    Start
                </button>
                <button
                    onClick={() => {
                        this.props.history.push('/help')
                    }}
                    className='button-pointer border-neon border-neon-orange'
                >
                    Help
                </button>
                {/* <button
                    onClick={() => {
                        this.props.history.push('/options')
                    }}
                    className='button-pointer border-neon border-neon-violet'
                >
                    Options
                </button> */}
                <button
                    onClick={() => {
                        this.props.history.push('/credits')
                    }}
                    className='button-pointer border-neon border-neon-lime'
                >
                    Credits
                </button>
            </div>
        )
    }
}

export default withRouter(Menu)
