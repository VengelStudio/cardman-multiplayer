import React, { Component } from "react"
import "./Options.css"

class Options extends Component {
	state = {}
	render() {
		return (
			<React.Fragment>
				<div className="options-wrapper border-neon border-neon-violet bg-dark text-nunito">
					<div className="options-content">
						<span className="nickname-options">
							<span>Change nickname:</span>
							<input className="slider-neon border-neon border-neon-violet change-nickname" />
						</span>
						<span className="country-options">
							<p>Country: </p>
							<img
								className="country-image-in-options"
								src="https://www.countryflags.io/pl/flat/64.png"
							/>
						</span>
						<span>
							<span>Music volume:</span>
							<input
								type="range"
								className="slider-neon border-neon border-neon-violet"
							/>
							<br />
							<span>Sound volume:</span>
							<input
								type="range"
								className="slider-neon border-neon border-neon-violet"
							/>
						</span>
					</div>
				</div>
			</React.Fragment>
		)
	}
}

export default Options
