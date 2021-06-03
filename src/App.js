import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages';
import Race from './pages/race';
import Charts from './pages/charts';
import WPM from './pages/wpm';
import Login from './pages/login';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/race' component={Race} />
        <Route path='/charts' component={Charts} />
        <Route path='/wpm' component={WPM} />
        <Route path='/login' component={Login} />
      </Switch>
    </Router>
  );
}

export default App;