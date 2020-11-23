import React, { Component } from 'react';
import { Button } from '../Utils/Utils';
import UserContext from '../../contexts/UserContext';

import './GameTableSeat.css';

export default class GameTableSeat extends Component {
  static contextType = UserContext;

  renderLoggedInUser = (player) => {
    return player.playerHand.map((card, index) => {
      return (
        <div key={index}>
          <input
            type="radio"
            className="player-card"
            id={card.value + card.suit}
            value={card.value}
            onChange={(e) => this.props.onCardChoice(e.target.value)}
          />
          <label>
            {card.value}
            {card.suit}
          </label>
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
              <div
                className="player-card-opponent"
                key={card.value + card.suit}
              >
                back
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  render() {
    const { player, seated, count } = this.props;
    return (
      <>
        {!player.playerName && !seated ? (
          <button
            value={player.playerSeat}
            onClick={(e) => this.props.claimSeat(e.target.value)}
          >
            claim seat {player.playerSeat}
          </button>
        ) : player.playerName === this.context.userData.player ? (
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
