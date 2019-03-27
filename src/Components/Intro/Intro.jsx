import React from 'react'
import '../../App.css'

class Intro extends React.Component {
    state = { display: true }
    componentDidMount() {
        setTimeout(() => {
            this.setState({ display: false })
        }, 2500)
    }
    render() {
        if (this.state.display) {
            return (
                <React.Fragment>
                    <div className='intro-logo'>
                        <div className='text-nunito intro-1'>Cardman&nbsp;</div>
                        <div className='text-nunito intro-2'>Multiplayer</div>
                    </div>
                </React.Fragment>
            )
        }
        return null
    }
}

export default Intro
