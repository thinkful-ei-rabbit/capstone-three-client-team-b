import React, { Component } from 'react';

import './GameTableSeat.css';

export default class GameTableSeat extends Component {
  render() {
    const { player } = this.props;
    return (
      <div className="player-seat">
        <h2>{player.playerName}</h2>
        <p>insert avatar image</p>
        <div className="player-hand">
          {player.playerHand.map((card) => {
            return (
              <div className="player-card">
                {card.value}
                {card.suit}
                {}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
