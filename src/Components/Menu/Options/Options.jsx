import React, { Component } from 'react'
import './Options.css'

class Options extends Component {
    state = {}
    render() {
        return (
            <React.Fragment>
                <div className='container of-rows options-wrapper border-neon border-neon-violet bg-dark text-nunito text-xlg'>
                    <div className='row content-vcenter content-hcenter width-full padding-sm'>
                        <div className='width-half container justify-center padding-sm'>
                            <span className='width-full'>Change nickname:</span>
                        </div>
                        <div className='width-half container justify-start padding-sm'>
                            <input className='input-neon padding-left-sm text-lg border-neon width-full border-neon-violet change-nickname' />
                        </div>
                    </div>
                    <div className='row content-vcenter content-hcenter width-full padding-sm'>
                        <div className='width-half container justify-center padding-sm'>
                            <span className='width-full'>Country:</span>
                        </div>
                        <div className='width-half container justify-center padding-sm'>
                            <img
                                className='options-flag-image'
                                src='https://www.countryflags.io/pl/flat/64.png'
                                alt='Flag icon.'
                            />
                        </div>
                    </div>
                    <div className='row content-vcenter content-hcenter width-full padding-sm'>
                        <div className='width-half container justify-center padding-sm'>
                            <span className='width-full'>Music volume:</span>
                        </div>
                        <div className='width-half container justify-start padding-sm'>
                            <input
                                type='range'
                                className='input-neon width-full border-neon border-neon-violet'
                            />
                        </div>
                    </div>
                    <div className='row content-vcenter content-hcenter width-full padding-sm'>
                        <div className='width-half container justify-center padding-sm'>
                            <span className='width-full'>Sound volume:</span>
                        </div>
                        <div className='width-half container justify-start padding-sm'>
                            <input
                                type='range'
                                className='input-neon width-full border-neon border-neon-violet'
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Options
