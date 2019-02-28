import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import "./Walkthrough.css"

class Walkthrough extends Component {
    state = { walkthroughVisibility: true, }
    closeWalkthrough = () => {
        this.setState({ walkthroughVisibility: false })
    }
    render() {
        let walkthroughClass = this.state.walkthroughVisibility ? "walkthrough" : "walkthrough-disabled"
        return (
            <div className={walkthroughClass}>
                <div className="ok-btn-wrapper" >
                    <button className="ok-btn border-neon border-neon-orange" onClick={this.closeWalkthrough}>OK</button>
                </div>
            </div>
        );
    }
}

export default Walkthrough;
