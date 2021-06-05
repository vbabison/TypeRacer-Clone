import React from 'react';
import { useHistory } from 'react-router-dom'

const GameMenu = (props) => {
  let history = useHistory();
  return (
    <div classnName="text-center">
      <h1>Welcome to Type Race</h1>
      <button type="button" onClick={()=> history.push('/race')}
                            className='btn btn-primary btn-lg mr-3'>Start Single Player</button>
      <button type="button" onClick={()=> history.push('/game/join')}
                            className='btn btn-primary btn-lg'>Join Multi-Player</button>
    </div>
  );
};

export default GameMenu;