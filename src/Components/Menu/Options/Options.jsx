import React, { Component } from 'react'
import './Options.css'

class Options extends Component {
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

    render() {
        return (
            <React.Fragment>
                <div className='container options-wrapper border-neon border-neon-violet bg-dark text-nunito'>
                    <div className='options-items'>
                        <div className='options-item'>
                            <span>{`Sound volume: ${
                                Math.round(this.state.volumeSettings.soundVol)
                                }%`}</span>
                            <div className='slider-wrapper input-neon border-neon border-neon-violet'>
                                <input
                                    type='range'
                                    min='0'
                                    max='100'
                                    id='sound-slider-thumb'
                                    className='options-slider slider'
                                    value={this.state.volumeSettings.soundVol}
                                    onChange={e => this.onChange(e)}
                                />
                            </div>
                        </div>
                        <div className='options-item'>
                            <span>{`Music volume: ${
                                Math.round(this.state.volumeSettings.musicVol)
                                }%`}</span>
                            <div className='slider-wrapper input-neon border-neon border-neon-violet'>
                                <input
                                    type='range'
                                    min='0'
                                    max='100'
                                    id='music-slider-thumb'
                                    className='options-slider slider'
                                    value={this.state.volumeSettings.musicVol}
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
            </React.Fragment>
        )
    }
}

export default Options
