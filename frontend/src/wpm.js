import React from 'react';
import axios from 'axios';

const WPM = () => {
  axios({
    method: 'GET',
    url: 'http://localhost:5000/wpm',
    success: function(response){
    }
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh'
      }}
    >
      <h1>WPM</h1>
    </div>
  );
};

export default WPM;