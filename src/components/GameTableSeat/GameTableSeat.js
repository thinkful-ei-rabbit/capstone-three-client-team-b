import React, { Component } from 'react';

import './GameTableSeat.css';

export default class GameTableSeat extends Component {
  renderLoggedInUser = (player) => {
    return player.playerHand.map((card) => {
      return (
        <div className="player-card" key={card.value + card.suit}>
          {card.value}
          {card.suit}
        </div>
      );
    });
  };

  renderOtherPlayers = (player, count) => {
    return (
      <div className={`player-seat-${player.playerSeat}-${count}player`}>
        <h2>{player.playerName}</h2>
        <div className="player-hand">
          {player.playerHand.map((card) => {
            return (
              <div className="player-card" key={card.value + card.suit}>
                back
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  render() {
    const { player, count } = this.props;
    return (
      <>
        {player.playerSeat === 1 ? (
          <div className={`player-seat-${player.playerSeat}`}>
            <div className="player-hand">{this.renderLoggedInUser(player)}</div>
            <h2>{player.playerName}</h2>
          </div>
        ) : (
          this.renderOtherPlayers(player, count)
        )}
      </>
    );
  }
}
