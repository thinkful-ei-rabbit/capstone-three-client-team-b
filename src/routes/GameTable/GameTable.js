import React, { Component } from 'react';
import Deck from '../../components/Deck/Deck';
import { Section, Button } from '../../components/Utils/Utils';

import './GameTable.css';

export default class GameTable extends Component {
  state = {
    players: [
      {
        playerName: 'host',
        currentPlayer: false, // just use isTurn instead
        playerSeat: 1,
        playerHand: [],
        // isTurn: false,
        askedPlayer: false,
        requestedCard: false,
      },
      {
        playerName: 'friend',
        currentPlayer: false,
        playerSeat: 2,
        playerHand: [],
        // isTurn: false,
        askedPlayer: false,
        requestedCard: false,
      },
      {
        playerName: '',
        currentPlayer: false,
        playerSeat: 3,
        playerHand: [],
        // isTurn: false,
        askedPlayer: false,
        requestedCard: false,
      },
      {
        playerName: '',
        currentPlayer: false,
        playerSeat: 4,
        playerHand: [],
        // isTurn: false,
        askedPlayer: false,
        requestedCard: false,
      },
    ],
    deck: [],
    inProgress: false,
  };
  // assign seat to player joining.  host is 'playerOne', first guest is 'playerTwo', etc
  // "deal" 7 cards to each player on start game click
  // prevent join after start is clicked and game 'inProgress'
  // random player starts, receives 'takingAction' true
  // when takingAction === true, click player to ask for a card, pick a card from your hand
  // trigger speaking bubble asking player name for card after request made

  createDeck = () => {
    const deck = new Deck();
    deck.shuffle();

    this.setState({
      deck,
    });
  };

  drawCard = (i) => {
    const deck = this.state.deck;
    const drawnCard = deck.draw();
    const { players } = this.state;

    players[i].playerHand.push(drawnCard);

    this.setState({
      players,
    });
  };

  // not working yet...
  startGame = () => {
    const players = [...this.state.players];
    for (let i = 0; i < players.length; i++) {
      while (players[i].playerName && players[i].playerHand.length < 7) {
        this.drawCard(i);
      }
    }
    players[1] ? players[1].currentPlayer = true : players[0].currentPlayer = false;
    this.setState({
      inProgress: true,
      players
    });
  };

  render() {
    return (
      <section>
        {this.state.players.find(player => player.currentPlayer) && <p>Current Player: {this.state.players.find(player => player.currentPlayer).playerName}</p>}
        <Button onClick={() => this.createDeck()}>Ready</Button>
        <Button onClick={() => this.startGame()}>Start Game</Button>
        <Button onClick={() => this.drawCard(0)}>Draw</Button>
      </section>
    );
  }
}