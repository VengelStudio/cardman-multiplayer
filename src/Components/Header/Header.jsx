import React, { Component } from 'react'
import './Header.css'
import Icon from 'react-icons-kit'
import { volume_2 } from 'react-icons-kit/ikons/volume_2'
import { note } from 'react-icons-kit/entypo/note'
import { cog } from 'react-icons-kit/fa/cog'

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            volumeSettings: {
                musicVol: this.props.volumeSettings.musicVol * 100,
                soundVol: this.props.volumeSettings.soundVol * 100
            }
        }
        console.log(this.state)
    }

    static getDerivedStateFromProps(props, state) {
        if (state.volumeSettings === !props.volumeSettings) {
            return {
                volumeSettings: props.volumeSettings
            }
        }
        return null
    }

    onChange = e => {
        if (e.target.id === 'sound-slider-thumb') {
            this.setState({
                volumeSettings: {
                    ...this.state.volumeSettings,
                    soundVol: e.target.value
                }
            })
        } else if (e.target.id === 'music-slider-thumb') {
            this.setState({
                volumeSettings: {
                    ...this.state.volumeSettings,
                    musicVol: e.target.value
                }
            })
        }
    }

    handleSave = () => {
        this.props.setSettings({
            soundVol: parseInt(this.state.volumeSettings.soundVol) / 100,
            musicVol: parseInt(this.state.volumeSettings.musicVol) / 100
        })
    }

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
                <div className='options-btn '>
                    <Icon icon={cog} size={32} className='gear-icon' />
                    <div className='dropdown-options button-pointer border-neon border-neon-translucent'>
                        <div className='settings-wrapper'>
                            <div className='options-items'>
                                <div className='options-item'>
                                    <span>{`Sound volume: ${Math.round(
                                        this.state.volumeSettings.soundVol
                                    )}%`}</span>
                                    <div className='slider-wrapper input-neon border-neon border-neon-violet'>
                                        <input
                                            type='range'
                                            min='0'
                                            max='100'
                                            id='sound-slider-thumb'
                                            className='options-slider slider'
                                            value={
                                                this.state.volumeSettings
                                                    .soundVol
                                            }
                                            onChange={e => this.onChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className='options-item'>
                                    <span>{`Music volume: ${Math.round(
                                        this.state.volumeSettings.musicVol
                                    )}%`}</span>
                                    <div className='slider-wrapper input-neon border-neon border-neon-violet'>
                                        <input
                                            type='range'
                                            min='0'
                                            max='100'
                                            id='music-slider-thumb'
                                            className='options-slider slider'
                                            value={
                                                this.state.volumeSettings
                                                    .musicVol
                                            }
                                            onChange={e => this.onChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className='options-item'>
                                    <div className='save-btn-wrapper'>
                                        <button
                                            onClick={this.handleSave}
                                            className='save-btn-wrapper border-neon border-neon-orange'
                                        >
                                            SAVE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='column auto has-background-dark header'>
                    {this.generateHeader()}
                </div>
            </div>
        )
    }
}

export default Header
