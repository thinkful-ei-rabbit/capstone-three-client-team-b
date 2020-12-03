import React, { Component } from 'react';
import { Section, Button } from '../Utils/Utils';
import UserContext from '../../contexts/UserContext';
import GameTableSeat from '../GameTableSeat/GameTableSeat';
import ChatLog from '../Chat/ChatLog';
import socketClient from 'socket.io-client';
import config from '../../config';
import { Link } from 'react-router-dom';

import './GameTable.css';

// better be ready to climb a mountain

let socket;
let currentSeatOfDOMPlayer;

export default class GameTable extends Component {
  constructor(props) {
    super(props);
    if (window.performance) {
      if (PerformanceNavigation.type == 1) {
        window.location.href = '/game';
      }
    }
  }
  static contextType = UserContext;

  state = {
    user: '',
    players: [
      {
        playerName: '',
        playerSeat: 1,
        playerHand: [],
        books: [],
        currentPlayer: false,
        requestedPlayer: '',
        requestedCard: '',
      },
      {
        playerName: '',
        playerSeat: 2,
        playerHand: [],
        books: [],
        currentPlayer: false,
        requestedPlayer: '',
        requestedCard: '',
      },
      {
        playerName: '',
        playerSeat: 3,
        playerHand: [],
        books: [],
        currentPlayer: false,
        requestedPlayer: '',
        requestedCard: '',
      },
      {
        playerName: '',
        playerSeat: 4,
        playerHand: [],
        books: [],
        currentPlayer: false,
        requestedPlayer: '',
        requestedCard: '',
      },
    ],
    goFishDisabled: true,
    askDisabled: true,
    deck: [],
    inProgress: false,
    seated: false,
    chatVisible: false,
    chatLog: {
      messages: [],
      connected: false,
    },
    endGame: false,
    winner: '',
  };

  componentDidMount = () => {
    socket = socketClient(`${config.API_SOCKET_ENDPOINT}`, {
      path: config.SOCKET_PATH,
      // path will be based on url
    });

    let count = 0;
    socket.on('messageResponse', (msg) => {
      // individual message response
      let feedback = document.getElementById('feedback');
      feedback.innerHTML = '';
      msg = (
        <div key={count}>
          <strong>{msg.user}</strong>: {msg.value}
        </div>
      );
      count++;
      this.setState({
        chatLog: {
          ...this.state.chatLog,
          messages: [msg, ...this.state.chatLog.messages],
        },
      });
    });

    this.onPlayerJoin();

    socket.on('server join denial', () => {
      window.location.href = '/game';
      alert('This game has already started');
    });

    socket.on('serverResponse', (retObj) => {
      // reset seats on everyone
      if (!this.state.inProgress) {
        currentSeatOfDOMPlayer = null;
        this.state.players.forEach((el, index) => {
          el.playerName = '';
          el.email = '';
        });

        this.setState({
          seated: false,
          self_info: this.state.self_info ? this.state.self_info : retObj.self,
          chatLog: {
            room: retObj.room,
            players: retObj.players,
            connected: true,
            messages: [...this.state.chatLog.messages, retObj.message],
          },
        });
      } else {
        this.setState({
          self_info: this.state.self_info ? this.state.self_info : retObj.self,
          chatLog: {
            room: retObj.room,
            players: retObj.players,
            connected: true,
            messages: [...this.state.chatLog.messages, retObj.message],
          },
        });
      }
    });

    socket.on('seat chosen', (retObj) => {
      const players = retObj.roomPlayers;
      const oppPlayer = players.find(
        (player) => player.playerName === retObj.name
      );

      const updatedPlayers = [...this.state.players];

      updatedPlayers[retObj.seat - 1].playerName = retObj.name;
      updatedPlayers[retObj.seat - 1].email = oppPlayer.email;

      this.setState({ players: updatedPlayers });
    });

    socket.on('game start RESPONSE', (hand) => {
      // on start game click, server response
      const updatedPlayers = [...this.state.players];

      // everyone is guaranteed 7 cards to start
      for (let i = 0; i < updatedPlayers.length; i++) {
        if (
          updatedPlayers[i].playerName !== currentSeatOfDOMPlayer.playerName &&
          updatedPlayers[i].playerName !== ''
        ) {
          // so, if someone else, give them 7
          updatedPlayers[i].handCount = 7;
        }
      }

      // currentSeat hand update
      currentSeatOfDOMPlayer.playerHand = hand.hand;

      updatedPlayers[
        currentSeatOfDOMPlayer.playerSeat - 1
      ] = currentSeatOfDOMPlayer;

      this.setState({
        inProgress: true,
        players: updatedPlayers,
      });
      // console.log(this.state.players);
    });

    socket.on('gameFull', (message) => {
      alert(message);
    });

    socket.on('rank request from player', (requestObj) => {
      this.setState({
        chatLog: {
          ...this.state.chatLog,
          asked: requestObj,
        },
      });
    });

    socket.on('go fish', (reqObj) => {
      const { asker, requested, rankReq } = reqObj;

      this.setState({
        goFishDisabled: false,
        askDisabled: true,
      });
    });

    socket.on('draw card denied', (msg) => {
      // deck empty
      alert(msg);
    });

    socket.on('update other player card count', (userObj) => {
      // not keeping track of which cards, just how many
      const updatedPlayers = [...this.state.players];
      const toUpdate = updatedPlayers.find(
        (el) => el.playerName === userObj.playerName
      );
      toUpdate.handCount = userObj.newCount;

      updatedPlayers[toUpdate.playerSeat - 1] = toUpdate;

      this.setState({
        players: updatedPlayers,
      });
    });

    socket.on('update other player books', (userObj) => {
      // not keeping track of which books, just how many
      const updatedPlayers = [...this.state.players];
      const toUpdate = updatedPlayers.find(
        (el) => el.playerName === userObj.playerName
      );
      toUpdate.books = [...userObj.playerBooks];

      updatedPlayers[toUpdate.playerSeat - 1] = toUpdate;
      console.log(toUpdate);
      this.setState({
        players: updatedPlayers,
      });
    });

    socket.on('draw card fulfilled', (cardObj) => {
      currentSeatOfDOMPlayer.playerHand.push(cardObj.card);
      const updatedPlayers = [...this.state.players];

      updatedPlayers[
        currentSeatOfDOMPlayer.playerSeat - 1
      ] = currentSeatOfDOMPlayer;

      this.setState({
        players: updatedPlayers,
      });

      this.setsChecker();
    });

    socket.on('correct rank return', (gameObj) => {
      const { CARD } = gameObj;
      currentSeatOfDOMPlayer.playerHand.push(CARD[0]);

      const updatedPlayers = [...this.state.players];
      updatedPlayers[
        currentSeatOfDOMPlayer.playerSeat - 1
      ] = currentSeatOfDOMPlayer;

      this.setState({
        players: updatedPlayers,
        askDisabled: false,
      });

      this.setsChecker();
    });

    socket.on('other player turn', (retObj) => {
      const updatedPlayers = [...this.state.players];
      // previous turn cleanup
      const prevPlayer = this.state.players.find(
        (el) => el.currentPlayer === true
      );

      if (prevPlayer) {
        prevPlayer.currentPlayer = false;
        updatedPlayers[prevPlayer.playerSeat - 1] = prevPlayer;
      }

      const name = retObj.playerName;
      const playerToUpdate = this.state.players.find(
        (el) => el.playerName === name
      );
      // update new other player turn
      playerToUpdate.currentPlayer = true;
      updatedPlayers[playerToUpdate.playerSeat - 1] = playerToUpdate;

      this.setState({
        players: updatedPlayers,
      });
    });

    socket.on('your turn', () => {
      // server decides which socket connection is next, so if this is called,
      // then it is this connection's turn
      const updatedPlayers = [...this.state.players];

      // make sure all players are false before setting current dom seat true
      updatedPlayers.forEach((el) => {
        el.currentPlayer = false;
      });

      currentSeatOfDOMPlayer.currentPlayer = true;

      updatedPlayers[
        currentSeatOfDOMPlayer.playerSeat - 1
      ] = currentSeatOfDOMPlayer;

      // enable go fish button on your turn if you have no cards
      // otherwise enable ask functionality
      this.setState({
        players: updatedPlayers,
        goFishDisabled:
          currentSeatOfDOMPlayer.playerHand.length > 0 ? true : false,
        askDisabled:
          currentSeatOfDOMPlayer.playerHand.length > 0 ? false : true,
      });
    });

    socket.on('typing', (data) => {
      let feedback = document.getElementById('feedback');
      console.log(data);
      feedback.innerHTML =
        '<p><em>' + data + ' is typing a message...</em></p>';
    });

    socket.on('game end', () => {
      console.log('game END');
      // client side displays

      this.displayWinner();
    });
  };

  onChatMessageSubmit = (event) => {
    event.preventDefault();
    const room = this.props.match.params.game_id;
    const userObj = {
      value: event.target['input-message'].value,
      room,
      user: this.state.user,
    };

    socket.emit('serverMessage', userObj);
    event.target['input-message'].value = '';
  };

  askOtherPlayer = (e) => {
    e.preventDefault();
    const requestedId = currentSeatOfDOMPlayer.requestedPlayer.id;
    const requestedName = this.state.chatLog.players.find(
      (el) => el.id === requestedId
    ).playerName;

    const rankReq = currentSeatOfDOMPlayer.requestedCard;
    const user_id = this.state.self_info.socket_id;
    const name = this.context.userData.player;
    const asker = {
      user_id,
      name,
      currentCount: currentSeatOfDOMPlayer.playerHand.length,
    };
    const requested = {
      requestedId,
      requestedName,
    };

    // need name and id of both users
    socket.emit('request rank from player', {
      asker,
      requested,
      rankReq,
    });

    currentSeatOfDOMPlayer.requestedCard = '';
    // console.log(currentSeatOfDOMPlayer);

    const updatedPlayers = [...this.state.players];

    updatedPlayers[
      currentSeatOfDOMPlayer.playerSeat - 1
    ] = currentSeatOfDOMPlayer;

    // disable ask function so user cannot ask more than once
    this.setState({
      players: updatedPlayers,
      askDisabled: true,
    });
  };

  yesResponse = () => {
    const player = currentSeatOfDOMPlayer;

    // VALIDATE - cannot lie in this version
    const cardInHand = player.playerHand.find(
      (el) => el.value == this.state.chatLog.asked.rankReq
    );

    if (cardInHand) {
      const index = player.playerHand.indexOf(cardInHand);

      const CARD = player.playerHand.splice(index, 1);
      socket.emit('rank request accept', {
        ...this.state.chatLog.asked,
        CARD,
        cardCount: player.playerHand.length,
      });
      // after yes or no click, return to basic screen
      this.setState({
        chatLog: {
          ...this.state.chatLog,
          asked: null,
        },
      });
    } else {
      alert(`You do not have any ${this.state.chatLog.asked.rankReq}s in hand`);
    }
  };

  noResponse = () => {
    // console.log(this.state.asked);

    // VALIDATE - cannot lie
    const player = currentSeatOfDOMPlayer;
    const cardInHand = player.playerHand.find(
      (el) => el.value == this.state.chatLog.asked.rankReq
    );
    if (cardInHand) {
      alert(`You do have a ${this.state.chatLog.asked.rankReq} in hand`);
    } else {
      socket.emit('rank request denial', {
        ...this.state.chatLog.asked,
      });
      // after yes or no click, return to basic screen
      this.setState({
        chatLog: {
          ...this.state.chatLog,
          asked: null,
        },
      });
    }
  };

  onPlayerJoin = () => {
    const room = this.props.match ? this.props.match.params.game_id : '';
    /* ROOM ID WILL BE BASED ON THIS ^ */
    const playerName = this.context.userData.player;
    const user_id = this.context.userData.id;
    const email = this.context.userData.email;
    const userObj = {
      room,
      playerName,
      user_id,
      email,
    };
    this.setState({ user: playerName });
    socket.emit('joinServer', userObj);
  };

  onCardChoice = (card, e) => {
    // console.log(card);
    e.preventDefault();

    currentSeatOfDOMPlayer.requestedCard = card;
    // console.log(currentSeatOfDOMPlayer);

    const updatedPlayers = [...this.state.players];

    updatedPlayers[
      currentSeatOfDOMPlayer.playerSeat - 1
    ] = currentSeatOfDOMPlayer;

    this.setState({
      players: updatedPlayers,
    });
  };
  onPlayerChoice = (playerObj) => {
    if (!playerObj.id) {
      // make sure there is an id
      const update = this.state.chatLog.players.find(
        (el) => el.playerName === playerObj.playerName
      );
      playerObj = update;
    }

    currentSeatOfDOMPlayer.requestedPlayer = playerObj;
    // console.log(currentSeatOfDOMPlayer);

    const updatedPlayers = [...this.state.players];

    updatedPlayers[
      currentSeatOfDOMPlayer.playerSeat - 1
    ] = currentSeatOfDOMPlayer;

    this.setState({
      players: updatedPlayers,
    });
  };

  gofish = () => {
    const playerName = this.context.userData.player;
    const cardCount = currentSeatOfDOMPlayer.playerHand.length;
    socket.emit('draw a card from the deck', {
      cardCount: cardCount,
      playerName: playerName,
    });

    this.nextTurn();
  };

  handleKeyPress = () => {
    const user = this.state.user;

    socket.emit('typing', user);
  };

  setsChecker = () => {
    // client side validation then send book to server

    const playerCards = currentSeatOfDOMPlayer.playerHand;
    const cardsInHand = {};
    // card.value and card.suit

    // create hashmap
    // each value, and indices of each
    for (let i = 0; i < playerCards.length; i++) {
      if (cardsInHand[playerCards[i].value]) {
        // save indices (arbitrary which data we store, just need to know how many)
        cardsInHand[playerCards[i].value].push(i);
      } else {
        cardsInHand[playerCards[i].value] = [i];
      }
    }

    const booksObj = [];
    // console.log(cardsInHand);
    for (var val in cardsInHand) {
      // iterate through hashmap: cardsInHand[val] = [...indices]
      if (cardsInHand[val].length >= 4) {
        // 4 of the same value is a book
        for (let i = 0; i < playerCards.length; i++) {
          // loop through player hand
          if (playerCards[i].value == val) {
            // remove the card object from the player hand
            booksObj.push(playerCards.splice(i, 1)[0]);
            i--;
          }
        }
        // store the val
        currentSeatOfDOMPlayer.books.push(val);
      }
    }
    // currentSeat is updated, since playerCards is a reference

    if (booksObj.length >= 1) {
      alert('A book was set down!');
      socket.emit('book found', {
        // booksObj, // guaranteed to have at least 4 card objects
        // userinfo (this.state.self_info.socket_id, or just socket.id, and/or this.context.username)
        cardsInBook: booksObj,
        playerBooks: currentSeatOfDOMPlayer.books,
        playerName: currentSeatOfDOMPlayer.playerName,
        playerCardCount: currentSeatOfDOMPlayer.playerHand.length,
      });

      const updatedPlayers = [...this.state.players];
      // currentSeatOfDOMPlayer.books = [...booksObj];

      updatedPlayers[
        currentSeatOfDOMPlayer.playerSeat - 1
      ] = currentSeatOfDOMPlayer;

      this.setState({
        players: updatedPlayers,
      });
    }
  };

  startGame = () => {
    const { players } = this.state.chatLog;
    // validate all seated
    const playerSeats = this.state.players;
    const allSeated =
      playerSeats.filter((el) => el.playerName !== '').length ===
      players.length;

    if (!allSeated) {
      return alert('Wait for everyone to choose their seat.');
    }

    if (players.length > 1) {
      socket.emit('start game', players);
    } else {
      alert('Not enough players in room, need 2 or more');
    }
  };

  displayWinner = () => {
    let winner = '';

    const { players } = this.state;

    for (let i = 0; i < players.length; i++) {
      //if player 0 wins
      if (
        players[0].books.length > players[1].books.length &&
        players[0].books.length > players[2].books.length &&
        players[0].books.length > players[3].books.length
      ) {
        winner = players[0].playerName;
        this.setState({
          winner: players[0].playerName,
        });

        // return players[0].playerName;
      }
      //if player 1 wins
      else if (
        players[1].books.length > players[0].books.length &&
        players[1].books.length > players[2].books.length &&
        players[1].books.length > players[3].books.length
      ) {
        winner = players[1].playerName;
        this.setState({
          winner: players[1].playerName,
        });
        // return players[1].playerName;
      }
      //if player 2 wins
      else if (
        players[2].books.length > players[0].books.length &&
        players[2].books.length > players[1].books.length &&
        players[2].books.length > players[3].books.length
      ) {
        winner = players[2].playerName;
        this.setState({
          winner: players[2].playerName,
        });
        // return players[2].playerName;
      }
      //if player 3 wins
      else if (
        players[3].books.length > players[0].books.length &&
        players[3].books.length > players[1].books.length &&
        players[3].books.length > players[2].books.length
      ) {
        winner = players[3].playerName;
        this.setState({
          winner: players[3].playerName,
        });
        // return players[2].playerName;
      }
      //if there's a tie everyone's a winner
      else {
        this.setState({
          winner: "It's a tie!",
        });
      }
    }

    this.setState({
      endGame: true,
    });

    const DOMwon = winner === currentSeatOfDOMPlayer.playerName ? true : false;
    socket.emit('game end database update', {
      user_id: this.context.userData.id,
      booksCollected: currentSeatOfDOMPlayer.books.length,
      win: DOMwon,
    });
  };

  claimSeat = (seat) => {
    let roomPlayers = this.state.chatLog.players;
    let name = this.context.userData.player;
    let players = [...this.state.players];
    let player = {
      ...players[seat - 1],
      playerName: this.context.userData.player,
    };
    if (!currentSeatOfDOMPlayer) {
      // current seat needed to update client hand without
      // updating all others
      currentSeatOfDOMPlayer = {
        ...players[seat - 1],
        playerName: this.context.userData.player,
      };
    }

    players[seat - 1] = player;
    this.setState({
      players,
      seated: true,
    });

    // console.log(name, seat, roomPlayers)
    socket.emit('claim seat', { name, seat, roomPlayers });
  };

  nextTurn = () => {
    currentSeatOfDOMPlayer.currentPlayer = false;

    const updatedPlayers = [...this.state.players];
    updatedPlayers[
      currentSeatOfDOMPlayer.playerSeat - 1
    ] = currentSeatOfDOMPlayer;

    this.setState({
      players: updatedPlayers,
      goFishDisabled: true,
      askDisabled: true,
    });

    socket.emit('next turn');

    // socket.id and turn indexing in the server
  };

  handleShowChat = () => {
    const chatVisible = !this.state.chatVisible;

    this.setState({
      chatVisible,
    });
  };

  render() {
    const { players, seated, endGame, winner } = this.state;
    const currentPlayerTurn = this.state.players.find(
      (el) => el.currentPlayer === true
    );

    return (
      <>
        {endGame === true ? (
          <div className="winner-display">
            The winner is {winner}! The game is over now.
            <br />
            <br />
            <Link to="/game">Return to lobby</Link>
          </div>
        ) : (
          <Section className="game-table">
            {players.map((player, index) => {
              return (
                <GameTableSeat
                  key={index}
                  player={player}
                  onPlayerChoice={this.onPlayerChoice}
                  onCardChoice={this.onCardChoice}
                  claimSeat={this.claimSeat}
                  seated={seated}
                />
              );
            })}
            <div>
              <Button
                onClick={() => this.handleShowChat()}
                className="chat-toggle"
              >
                &#128488;
              </Button>
            </div>
            <div className="center">
              <div className="player-turn-announce">
                {currentPlayerTurn
                  ? `${currentPlayerTurn.playerName}'s turn`
                  : ''}
              </div>
              <div id="feedback" className="feedback"></div>
              {!this.state.inProgress ? (
                <Button onClick={() => this.startGame()}>Start Game</Button>
              ) : !this.state.goFishDisabled ? (
                <Button onClick={this.gofish}>Go Fish!</Button>
              ) : (
                <div></div>
              )}
              <ChatLog
                match={this.props.match}
                handleKeyPress={this.handleKeyPress}
                onChatMessageSubmit={this.onChatMessageSubmit}
                askAnotherPlayer={this.askOtherPlayer}
                requestedCard={
                  currentSeatOfDOMPlayer
                    ? currentSeatOfDOMPlayer.requestedCard
                    : ''
                }
                onPlayerChoice={this.onPlayerChoice}
                requestedPlayer={
                  currentSeatOfDOMPlayer
                    ? currentSeatOfDOMPlayer.requestedPlayer
                    : {
                        playerName: '',
                        id: '',
                      }
                }
                askDisabled={this.state.askDisabled}
                yesResponse={this.yesResponse}
                noResponse={this.noResponse}
                upperState={this.state.chatLog}
                chatRenders={this.state.chatRenders}
                chatVisible={this.state.chatVisible}
              />
            </div>
          </Section>
        )}
      </>
    );
  }
}
