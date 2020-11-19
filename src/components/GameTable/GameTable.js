import React, { Component } from 'react';
import Deck from '../Deck/Deck';
import { Section, Button } from '../Utils/Utils';
import UserContext from '../../contexts/UserContext';
import GameTableSeat from '../GameTableSeat/GameTableSeat';
import ChatLog from '../Chat/ChatLog';

import './GameTable.css';

export default class GameTable extends Component {
  static contextType = UserContext;

  state = {
    players: [
      {
        playerName: 'player1',
        playerSeat: 1,
        playerHand: [],
        currentPlayer: true,
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
    ready: false,
  };

  createDeck = () => {
    const deck = new Deck();
    deck.shuffle();

    this.setState({
      deck: deck, ready: true
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

  gofish = () => {
    const players = this.state.players
    const deck = this.state.deck
    players.map(player => {
      if (player.currentPlayer === true) {
        return player.playerHand.push(deck.cards[0])
      }
    })
    deck.cards.shift()
    this.setState({ players, deck })
  }
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

  requestCard = () => {
    console.log('hi');
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
                  requestCard={this.requestCard}
                />
              );
            })}
        </Section>
        <Button disabled={this.state.inProgress === true} onClick={() => this.createDeck()}>Ready</Button>
        <Button disabled={this.state.ready === false || this.state.inProgress === true} onClick={() => this.startGame()}>Start Game</Button>
        <Button disabled={this.state.inProgress === false || this.state.deck.cards.length === 0} onClick={this.gofish}>Draw</Button>
        <ChatLog match={this.props.match} />
      </>
    );
  }
}
