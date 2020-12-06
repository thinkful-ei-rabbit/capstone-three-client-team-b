import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class NoWinner extends Component {
  render() {
    return (
      <div className="winner-display">
        Sorry... One of the players disconnected and caused the game to end
        unexpectedly.
        <br />
        <br />
        <Link to="/game">Return to lobby</Link>
      </div>
    );
  }
}
