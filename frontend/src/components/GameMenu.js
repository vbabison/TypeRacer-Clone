import React from 'react';
import { Route, useHistory } from 'react-router-dom';

const GameMenu = (props) => {
  let history = useHistory();

  function handleClick() {
    history.push("/game/join");
  }

  return (
    <div classnName="text-center">
      <h1>Welcome to Type Race</h1>
      <button type="button" onClick={()=> history.push('/race')}
                            className='btn btn-primary btn-lg mr-3'>Start Single Player</button>
      <button type="button" onClick={handleClick}
                            className='btn btn-primary btn-lg'>Join Multi-Player</button>
    </div>
  );
};

export default GameMenu;