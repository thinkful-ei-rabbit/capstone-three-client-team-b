import React, { Component } from 'react';
import UserContext from '../../contexts/UserContext';
import images from '../../images/images.js';

import './GameTableSeat.css';

export default class GameTableSeat extends Component {
  static contextType = UserContext;

  static defaultProps = {
    player: {
      playerName: '',
    },
  };

  renderLoggedInUser = (player) => {
    player.playerHand.sort(function (a, b) {
      return a.value - b.value;
    });

    return player.playerHand.map((card) => {
      const suitValue = card.suit + card.value;

      return (
        <li
          key={card.value + card.suit}
          onClick={(e) => this.props.onCardChoice(card.value, e)}
        >
          <a className="card" href="#">
            <img src={images[suitValue]} alt="card value" />
          </a>
        </li>
      );
    });
  };

  renderOtherPlayers = (player) => {
    let cardBacks = [];
    for (let i = 0; i < player.handCount; i++) {
      cardBacks.push(
        <li key={i}>
          <p className="card">
            <img src={images.back} alt="back of playing card" />
          </p>
        </li>
      );
    }
    return (
      <>
        {player.playerName ? (
          <div className={`player-seat-${player.playerSeat} rotateHand`}>
            <div className="name">
              <h2>{player.playerName}</h2>
              <img
                className="player-avatar"
                src={player.avatarLink}
                alt="player avatar"
              />
            </div>
            <ul className="hand">{cardBacks}</ul>
          </div>
        ) : (
          <div></div>
        )}
      </>
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
