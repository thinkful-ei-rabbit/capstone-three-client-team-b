import React, { Component } from 'react';
import { Button } from '../Utils/Utils';
import UserContext from '../../contexts/UserContext';

import './GameTableSeat.css';

const suitReferences = {
  h: 'heart',
  c: 'club',
  s: 'spade',
  d: 'diamond',
};

export default class GameTableSeat extends Component {
  static contextType = UserContext;

  renderLoggedInUser = (player) => {
    return player.playerHand.map((card, index) => {
      const suitRef = suitReferences[card.suit];
      const imageLocation = `../../images/${card.value}${suitRef}.png`;

      return (
        <>
          <li key={index}>
            <a
              className="card"
              onClick={() => this.props.onCardChoice(card.value)}
              style={{ backgroundImage: `url(${imageLocation})` }}
            >
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
    const { player, seated, count } = this.props;
    return (
      <>
        {!player.playerName && !seated ? (
          <button
            value={player.playerSeat}
            onClick={(e) => this.props.claimSeat(e.target.value)}
            className={`player-seat-${player.playerSeat} claim-seat-button`}
          >
            <span className="plus">+</span>
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
