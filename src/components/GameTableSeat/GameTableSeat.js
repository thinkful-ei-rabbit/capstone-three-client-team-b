import React, { Component } from 'react';
import UserContext from '../../contexts/UserContext';
import images from '../../images/images.js';
import Gravatar from 'react-gravatar';
import { Button } from '../Utils/Utils';

import './GameTableSeat.css';

export default class GameTableSeat extends Component {
  static contextType = UserContext;

  static defaultProps = {
    player: {
      playerName: '',
    },
    playerPlacement: [],
    endGame: false,
  };

  state = {
    playerOrder: [],
  };

  renderLoggedInUser = (player) => {
    if (this.props.player.playerHand.length > 0) {
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
            <a className="card card-player" href="#">
              <img
                src={images[suitValue]}
                alt="card value"
                className="card-image"
              />
            </a>
          </li>
        );
      });
    } else if (
      this.props.player.playerHand.length === 0 &&
      this.props.player.currentPlayer &&
      !this.props.endGame
    ) {
      return (
        <Button
          className="draw-button"
          onClick={() => {
            this.props.gofish();
          }}
        >
          Draw and Pass
        </Button>
      );
    } else if (this.props.endGame) {
      return '';
    }
  };

  renderOtherPlayers = (player) => {
    let playerOrder = this.props.playerPlacement;
    if (playerOrder[0].playerName !== this.context.userData.player) {
      playerOrder.push(playerOrder.shift());
    }
    const playerIndex = playerOrder.findIndex(
      (indv) => indv.playerName === player.playerName
    );
    let cardBacks = [];
    for (let i = 0; i < player.handCount; i++) {
      cardBacks.push(
        <li key={i}>
          <p className="card card-opponent">
            <img
              src={images.back}
              alt="back of playing card"
              className="card-image"
            />
          </p>
        </li>
      );
    }
    return (
      <>
        {player.playerName ? (
          <div
            className={`player-seat-${playerIndex} rotateHand`}
            onClick={() => this.props.onPlayerChoice(player)}
          >
            <ul className="opponent-hand">{cardBacks}</ul>
            <div className="opponent-player">
              <Gravatar email={this.props.player.email} size={75} />
              <div className="opponent-details">
                <h3 className="name">{player.playerName}</h3>
                <div>
                  <p className="hand-count books">cards: {cardBacks.length}</p>
                  <p className="books">
                    books: {this.props.player.books.length}
                  </p>
                </div>
              </div>
            </div>
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
            className="claim-seat-button"
          >
            +
          </button>
        ) : player.playerName === this.context.userData.player ? (
          <div className={`player-logged-in rotateHand`}>
            <ul className="hand">{this.renderLoggedInUser(player)}</ul>
            <div className="player">
              <Gravatar email={this.context.userData.email} size={75} />
              <div className="player-details">
                <h3 className="name">{player.playerName}</h3>
                <p className="books">books: {this.props.player.books.length}</p>
              </div>
            </div>
          </div>
        ) : (
          this.renderOtherPlayers(player)
        )}
      </>
    );
  }
}
