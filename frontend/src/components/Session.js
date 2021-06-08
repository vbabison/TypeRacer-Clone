import React, { useState, useEffect, Component } from "react";
import axios from "axios";
const Session = () => {

  const saveSession = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <button onClick={saveSession}>Save</button>
    </div>
  );
};

export default Session;