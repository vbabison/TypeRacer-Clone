import React, { Component } from 'react';
import Preview from '../components/race/Preview';
import Speed from '../components/race/Speed';
import getText from '../components/race/getText';
import './race.css';
const express = require('express');
const app = express();
const socketio = require('socket.io');
const mongoose = require('mongoose');
const Game = require('./models/game');
const QuotableAPI = require('./QuotableAPI');
const expressServer = app.listen(3001);
const io = socketio(expressServer);
mongoose.connect('mongodb://localhost:27017/typeracerTutorial',{useNewUrlParser : true, useUnifiedTopology : true}, ()=>{ console.log('successfully connected to database')});

const initialState = {
  text: getText(),
  userInput: '',
  symbols: 0,
  sec: 0,
  started: false,
  finished: false
}

class Race extends Component {

  state = initialState;

  onRestart = () => {
    this.setState(initialState)
  }

  onUserInputChange = (e) => {
    const v = e.target.value;
    this.setTimer();
    this.onFinish(v)
    this.setState({
      userInput: v,
      symbols: this.countCorrectSymbols(v)
    })
  }

  onFinish(userInput) {
    if (userInput === this.state.text) {
      clearInterval(this.interval);
      this.setState({
        finished: true
      })
    }
  }

  countCorrectSymbols(userInput) {
    const text = this.state.text.replace(' ', '');
    return userInput.replace(' ', '').split('').filter((s,i) => s === text[i]).length;
  }

  setTimer() {
    if (!this.state.started) {
      this.setState({started: true});
      this.interval = setInterval(() => {
        this.setState(prevProps => {
          return {sec: prevProps.sec + 1}
        })
      }, 1000)
    }
  }

  render() {
    return (
      <div className="container mt-5 mb-5">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <Preview text={this.state.text} userInput={this.state.userInput}/>
            <textarea
              value={this.state.userInput}
              onChange={this.onUserInputChange}
              className="form-control mb-3"
              placeholder="Start typing..."
              readOnly={this.state.finished}
            ></textarea>
            <Speed sec={this.state.sec} symbols={this.state.symbols}/>
            <div className="text-right">
              <button className="btn btn-light" onClick={this.onRestart}>Restart</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Race;