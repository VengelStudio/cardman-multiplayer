import React, { Component } from 'react'
import './Header.css'

class Header extends Component {
    generateHeader = () => {
        if (this.props.score) {
            return (
                <div className='title has-text-white-ter'>
                    <div className='scoreHeader'>
                        <div className='flex-item me'>
                            <span>{this.props.score.me}</span>
                        </div>
                        <div className='flex-item score'>
                            <span>{this.props.score.myScore}</span>
                            <span>{`:`}</span>
                            <span>{this.props.score.enemyScore}</span>
                        </div>
                        <div className='flex-item enemy'>
                            <span>{this.props.score.enemy}</span>
                        </div>
                    </div>
                </div>
            )
        } else if (this.props.title) {
            return (
                <h1 className='title has-text-white-ter'>{this.props.title}</h1>
            )
        }
    }
    render() {
        return (
            <div className='row header width-full semi-bold bg-dark color-lightblue padding-sm height-sm text-lg content-hcenter content-vcenter'>
                <div className='column auto has-background-dark header'>
                    {this.generateHeader()}
                </div>
            </div>
        )
    }
}

export default Header
