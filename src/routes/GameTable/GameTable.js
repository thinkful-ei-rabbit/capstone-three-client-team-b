import React, { Component } from 'react';
import Deck from '../../components/Deck/Deck';
import { Section, Button } from '../../components/Utils/Utils';

import './GameTable.css';

export default class GameTable extends Component {
  state = {
    players: {
      1: {
        playerName: 'host',
        playerHand: [],
      },
      2: {
        playerName: '',
        playerHand: [],
      },
      3: {
        playerName: '',
        playerHand: [],
      },
      4: {
        playerName: '',
        playerHand: [],
      },
    },
    deck: [],
  };
  // assign seat to player joining.  host is 'playerOne', first guest is 'playerTwo', etc
  // "deal" 7 cards to each player on start game click
  // prevent join after start is clicked and game 'inProgress'
  // random player starts, receives 'takingAction' true
  // when takingAction === true, click player to ask for a card, pick a card from your hand
  // trigger speaking bubble asking player name for card after request made

  startGame = () => {
    const deck = new Deck();
    deck.shuffle();

    this.setState({
      deck,
    });
  };

  drawCard = (player) => {
    const deck = this.state.deck;
    const drawnCard = deck.draw();
    const { players } = this.state;

    players[1].playerHand.push(drawnCard);

    this.setState({
      players,
    });
  };

  // not working yet...
  dealFirstHand = () => {
    const { players } = this.state;

    console.log(players);
  };

  render() {
    return (
      <section>
        <Button onClick={() => this.startGame()}>Start</Button>
        <Button onClick={() => this.drawCard()}>Draw</Button>
        <Button onClick={() => this.dealFirstHand()}>Deal First Hand</Button>
      </section>
    );
  }
}
