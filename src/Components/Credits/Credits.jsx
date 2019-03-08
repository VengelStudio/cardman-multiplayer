import React, { Component } from 'react'
import './Credits.css'
import Logo from '../../Resources/Images/logo-small.png'
//*react icons is removed
// import { GoMarkGithub, GoMail } from 'react-icons/go'
// import { IconContext } from 'react-icons'

class Credits extends Component {
    state = {}
    render() {
        return (
            <React.Fragment>
                <div className='container of-rows credits-wrapper border-neon border-neon-red bg-dark text-nunito text-xlg'>
                    <p className='credits-header'>Cardman Multiplayer</p>
                    <div className='developer-wrapper'>
                        <p className='text-xlg'>Created by:</p>
                        <div className='developers-content'>
                            <p>Bartosz Kępka</p>
                            <p>Łukasz Blachnicki</p>
                        </div>
                    </div>
                    <div className='divider' />
                    <div className='logos'>
                        <a href='mailto:vengelstudio@gmail.com'>
                            <IconContext.Provider
                                value={{ color: '#141414', className: 'logo' }}
                            >
                                <GoMail />
                            </IconContext.Provider>
                        </a>
                        <img src={Logo} className='logo' alt='' />
                        <a href='https://github.com/VengelStudio'>
                            <IconContext.Provider
                                value={{ color: '#141414', className: 'logo' }}
                            >
                                <GoMarkGithub />
                            </IconContext.Provider>
                        </a>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Credits
