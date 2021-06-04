import React, { useState, useEffect, Component } from "react";
import './App.css';
import Nav from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages';
import Race from './pages/race';
import Charts from './pages/charts';
import Passages from './pages/passages';
import Session from "./components/Session";
import Login from './pages/login';
import Register from './pages/register';
import AuthService from "./pages/services/auth.service";
import history from './history';
import GameMenu from './components/GameMenu';

function App(props) {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [showModal, setShowModal] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
  };

  const closeModal = () => {
    setShowModal(false);
  }

  return (
    <Router>
      <Nav currentUser={currentUser} setShowModal={setShowModal} logOut={logOut} />
      
      <Switch>
        <Route exact path='/' component={GameMenu} />
        <Route path='/race' component={Race} />
        <Route path='/charts' component={Charts} />
        <Route path='/passages' component={Passages} />
        <Route path='/login' component={Login} >
        <div id="popupModal" className="overlay" style={{visibility: showModal ? 'visible' : 'hidden', opacity: showModal ? 1 : 0}}>
          <div className="popup">
            <a className="close" href="#" onClick={closeModal}>&times;</a>
            {!hasAccount ? (
                <Login hasAccount={hasAccount} setHasAccount={setHasAccount} />
            ) : (
                <Register hasAccount={hasAccount} setHasAccount={setHasAccount} />
            )}
          </div>
        </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;