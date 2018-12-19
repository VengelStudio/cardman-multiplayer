import React from 'react';
import './PlayersBrowser.css';
import Scrollbar from 'react-scrollbars-custom';

const BrowserEntry = props => {
  let classes = 'browser-entry width-full ';
  if (props.lightColor === true) {
    classes += 'browser-entry-lightbg';
  } else if (props.lightColor === false) {
    classes += 'browser-entry-darkbg';
  }

  const handleGameStart = () => {
    console.log('start');
  };

  return (
    <div className={classes}>
      <span className='player-info'>
        <img className='country' src='https://www.countryflags.io/pl/flat/64.png' />
        <span className='nickname'>{props.nickname}</span>
      </span>
      <button onClick={handleGameStart} className='play border-neon border-neon-lime'>
        Play
      </button>
    </div>
  );
};

const PlayersBrowser = props => {
  const players = [
    { nickname: 'Dezanek' },
    { nickname: 'Szymek' },
    { nickname: 'Kobus' },
    { nickname: 'Pawlacz' },
    { nickname: 'Twoja stara' },
    { nickname: 'Dezanek' },
    { nickname: 'Szymek' },
    { nickname: 'Kobus' },
    { nickname: 'Pawlacz' },
    { nickname: 'Twoja stara' },
    { nickname: 'Dezanek' },
    { nickname: 'Szymek' },
    { nickname: 'Kobus' },
    { nickname: 'Pawlacz' },
    { nickname: 'Twoja stara' },
    { nickname: 'Dezanek' },
    { nickname: 'Szymek' },
    { nickname: 'Kobus' },
    { nickname: 'Pawlacz' },
    { nickname: 'Twoja stara' },
    { nickname: 'Dezanek' },
    { nickname: 'Szymek' },
    { nickname: 'Kobus' },
    { nickname: 'Pawlacz' },
    { nickname: 'Twoja stara' }
  ];

  const getEntries = players => {
    let result = [];
    for (let index in players) {
      let nickname = players[index].nickname;
      if (index % 2 === 0) {
        result.push(<BrowserEntry nickname={nickname} key={index} lightColor={true} />);
      } else {
        result.push(<BrowserEntry nickname={nickname} key={index} lightColor={false} />);
      }
    }
    return result;
  };

  let entries = getEntries(players);
  console.log(entries);

  return (
    <div className='players-browser container content-vcenter border-neon border-neon-orange'>
      <div className='players-browser-title bg-lightgrey width-full text-xlg text-center'>
        <p>
          You are logged in as <b>{props.nickname}</b>.
        </p>
      </div>
      <Scrollbar style={{ width: '100%', height: '100%' }}>
        {entries.map(entry => {
          return entry;
        })}
      </Scrollbar>
    </div>
  );
};

export default PlayersBrowser;
