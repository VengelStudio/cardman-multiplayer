import React, { Component } from 'react'
import './Help.css'

class Help extends Component {
  render() {
    return (
      <React.Fragment>
        <div className='help-wrapper container of-rows border-neon border-neon-red bg-dark text-nunito text-lg'>
          <p className='help-header'>
            Hangman Multiplayer is a turn based game where your goal is to guess the randomly generated word before your
            opponent does.{' '}
          </p>
          <p>During your turn you have 3 options to choose from:</p>
          <ul>
            <li>Pick a letter from the keyboard</li>
            <li>Play a card from your deck</li>
            <li>Surrender</li>
          </ul>
          <p>Person who first guess the word wins</p>
          <p className='good-luck'>Good Luck!</p>
        </div>
      </React.Fragment>
    )
  }
}

export default Help
