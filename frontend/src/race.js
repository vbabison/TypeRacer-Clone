import React, { Component } from 'react';
import Preview from './components/race/Preview';
import Speed from './components/race/Speed';
import getText from './components/race/getText';
import './race.css';
import axios from 'axios';
import AuthService from "./services/auth.service";

const initialState = {
  text: getText(),
  userInput: '',
  symbols: 0,
  sec: 0,
  wpm: 0,
  started: false,
  finished: false,
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
    const { wpm } = this.state;
    if (userInput === this.state.text) {
      axios({
        method: 'post',
        url: 'http://localhost:5000/race',
        data: {
          user: AuthService.getCurrentUser(),
          wpm: Math.round(((this.state.symbols/5) / (this.state.sec/60))),
        }
      });
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
            <Preview id="textarea" text={this.state.text} userInput={this.state.userInput}/>
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