import React, { Component } from 'react';
import { Button } from '../Utils/Utils';
import UserContext from '../../contexts/UserContext';

import './GameTableSeat.css';

export default class GameTableSeat extends Component {
  static contextType = UserContext;

  renderLoggedInUser = (player) => {
    return player.playerHand.map((card, index) => {
      return (
        <>
          <li key={index}>
            <a className="card">
              <span className="rank">{card.value}</span>
              <span className="suit">{card.suit}</span>
            </a>
          </li>
        </>
      );
    });
  };

  renderOtherPlayers = (player, count) => {
    return (
      <div className={`player-seat-${player.playerSeat}`}>
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
    const { player, seated, count, avatar } = this.props;
    return (
      <>
        {!player.playerName && !seated ? (
          <button
            value={player.playerSeat}
            onClick={(e) => this.props.claimSeat(e.target.value)}
            className={`player-seat-${player.playerSeat} claim-seat-button`}
          >
            claim seat {player.playerSeat}
          </button>
        ) : player.playerName === this.context.userData.player ? (
          <div className={`player-seat-${player.playerSeat} rotateHand`}>
            <ul className="hand">{this.renderLoggedInUser(player)}</ul>
            <div className="name">
              <h2 className="name">{player.playerName}</h2>
              <img
                className="player-avatar"
                src={this.context.userData.avatar}
                alt="player avatar"
              />
            </div>
          </div>
        ) : (
          this.renderOtherPlayers(player, count)
        )}
      </>
    );
  }
}
