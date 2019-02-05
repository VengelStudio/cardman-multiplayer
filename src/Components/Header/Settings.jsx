import React, { Component } from 'react'
import Icon from 'react-icons-kit'
import { volume_2 } from 'react-icons-kit/ikons/volume_2'
import { note } from 'react-icons-kit/entypo/note'
import { cog } from 'react-icons-kit/fa/cog'

const { roundAndConvertVolume } = require('./Functions')

class Settings extends Component {
    onChange = e => {
        if (e.target.id === 'sound-slider-thumb') {
            this.props.setSettings({
                soundVol: roundAndConvertVolume(e.target.value),
                musicVol: this.props.volumeSettings.musicVol
            })
        } else if (e.target.id === 'music-slider-thumb') {
            this.props.setSettings({
                soundVol: this.props.volumeSettings.soundVol,
                musicVol: roundAndConvertVolume(e.target.value)
            })
        }
    }

    render() {
        let soundVol = this.props.volumeSettings.soundVol * 100
        let musicVol = this.props.volumeSettings.musicVol * 100
        return (
            <div className='options-btn '>
                <Icon icon={cog} size={32} className='gear-icon' />
                <div className='dropdown-options border-neon border-neon-translucent'>
                    <div className='settings-wrapper'>
                        <div className='options-items'>
                            <div className='options-item'>
                                <Icon icon={volume_2} size={16} />
                                <span>{`Sound volume: ${soundVol}%`}</span>
                                <div className='slider-wrapper input-neon border-neon border-neon-violet'>
                                    <input
                                        type='range'
                                        min='0'
                                        max='100'
                                        id='sound-slider-thumb'
                                        className='options-slider slider'
                                        value={soundVol}
                                        onChange={e => this.onChange(e)}
                                    />
                                </div>
                            </div>
                            <div className='options-item'>
                                <Icon icon={note} size={16} />
                                <span>{`Music volume: ${musicVol}%`}</span>
                                <div className='slider-wrapper input-neon border-neon border-neon-violet'>
                                    <input
                                        type='range'
                                        min='0'
                                        max='100'
                                        id='music-slider-thumb'
                                        className='options-slider slider'
                                        value={musicVol}
                                        onChange={e => this.onChange(e)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Settings
