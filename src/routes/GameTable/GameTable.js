import React, { Component } from 'react';
import Deck from '../../components/Deck/Deck';
import { Section, Button } from '../../components/Utils/Utils';
import UserContext from '../../contexts/UserContext';
import GameTableSeat from '../../components/GameTableSeat/GameTableSeat';

import './GameTable.css';

export default class GameTable extends Component {
  static contextType = UserContext;

  state = {
    players: [
      {
        playerName: 'player1',
        playerSeat: 1,
        playerHand: [],
        currentPlayer: false,
        requestedPlayer: '',
        requestedCard: '',
      },
      {
        playerName: 'player2',
        playerSeat: 2,
        playerHand: [],
        currentPlayer: false,
        requestedPlayer: '',
        requestedCard: '',
      },
      {
        playerName: '',
        playerSeat: 3,
        playerHand: [],
        currentPlayer: false,
        requestedPlayer: '',
        requestedCard: '',
      },
      {
        playerName: '',
        playerSeat: 4,
        playerHand: [],
        currentPlayer: false,
        requestedPlayer: '',
        requestedCard: '',
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

  countPlayers = () => {
    let count = 0;
    for (let i = 0; i < this.state.players.length; i++) {
      if (this.state.players[i].playerName) {
        count++;
      }
    }
    return count;
  };

  startGame = () => {
    const { players } = this.state;
    for (let i = 0; i < players.length; i++) {
      while (players[i].playerName && players[i].playerHand.length < 7) {
        this.drawCard(i);
      }
    }
    this.setState({
      inProgress: true,
    });
  };

  render() {
    const { players } = this.state;
    const count = this.countPlayers();
    return (
      <>
        <Section className="game-table">
          {players
            .filter((player) => player.playerName)
            .map((player) => {
              return (
                <GameTableSeat
                  key={player.playerSeat}
                  player={player}
                  count={count}
                />
              );
            })}
        </Section>
        <Button onClick={() => this.createDeck()}>Ready</Button>
        <Button onClick={() => this.startGame()}>Start Game</Button>
        {/* <Button onClick={(e) => this.drawCard(e.target)}>Draw</Button> */}
      </>
    );
  }
}
