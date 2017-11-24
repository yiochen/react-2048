import React, { Component } from 'react';
import logo from './logo.svg';
import Board from './components/Board';
import './App.css';

class App extends Component {
  state = {
    game: 0,
    score: 0,
  };
  handleDie = () => this.setState({ game: this.state.game + 1, score: 0 });
  handleScore = score => this.setState({ score });
  render() {
    return (
      <div className="App">
        <h1>Score: {this.state.score}</h1>
        <Board onDie={this.handleDie} onScore={this.handleScore} game={this.state.game} />
      </div>
    );
  }
}

export default App;
