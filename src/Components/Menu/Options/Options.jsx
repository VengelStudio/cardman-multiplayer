import React, { Component } from 'react'
import './Options.css'

class Options extends Component {
    state = {}
    render() {
        return (
            <React.Fragment>
                <div className='container options-wrapper border-neon border-neon-violet bg-dark text-nunito'>
                    <div className="options-items">
                        <div className="options-item">
                            <p>Change nickname</p>
                            <input></input>
                        </div>
                        <div className="options-item">
                            <span>Sound volume</span>
                            <div className="slidecontainer">
                                <input type="range" min="1" max="100" class="slider" id="myRange"></input>
                            </div>
                        </div>
                        <div className="options-item">
                            <span>Music volume</span>
                            <div className="slidecontainer">
                                <input type="range" min="1" max="100" class="slider" id="myRange"></input>
                            </div>
                        </div>
                        <div className="save-btn-wrapper">
                            <button>SAVE</button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Options
