import React, { Component } from 'react';
import UserContext from '../../contexts/UserContext';
import images from '../../images/images.js';

import './GameTableSeat.css';

export default class GameTableSeat extends Component {
  static contextType = UserContext;

  renderLoggedInUser = (player) => {
    return player.playerHand.map((card, index) => {
      const suitValue = card.suit + card.value;

      return (
        <>
          <li
            key={index}
            className="card"
            onClick={() => this.props.onCardChoice(card.value)}
          >
            <img src={images[suitValue]} alt="card value" />
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
          {player.handCount}
          {/* {player.handCount.map((card, index) => {
            return (
              <div
                className="player-card-opponent"
                key={index}
              >
                back
              </div>
            );
          })} */}
        </div>
      </div>
    );
  };

  render() {
    const { player, seated } = this.props;
    return (
      <>
        {!player.playerName && !seated ? (
          <button
            value={player.playerSeat}
            onClick={(e) => this.props.claimSeat(e.target.value)}
            className={`player-seat-${player.playerSeat} claim-seat-button`}
          >
            +
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
          this.renderOtherPlayers(player)
        )}
      </>
    );
  }
}
