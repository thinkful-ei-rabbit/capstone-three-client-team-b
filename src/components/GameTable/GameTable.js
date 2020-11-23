import React, { Component } from 'react';
import Deck from '../Deck/Deck';
import { Section, Button } from '../Utils/Utils';
import UserContext from '../../contexts/UserContext';
import GameTableSeat from '../GameTableSeat/GameTableSeat';
import ChatLog from '../Chat/ChatLog';
import socketClient from 'socket.io-client';
import config from '../../config';

import './GameTable.css';

let socket;
let currentSeatOfDOMPlayer;

export default class GameTable extends Component {
  static contextType = UserContext;

  state = {
    user: '',
    players: [
      {
        playerName: '',
        avatarLink: '',
        playerSeat: 1,
        playerHand: [],
        books: [],
        currentPlayer: false,
        requestedPlayer: '',
        requestedCard: '',
      },
      {
        playerName: '',
        avatarLink: '',
        playerSeat: 2,
        playerHand: [],
        books: [],
        currentPlayer: false,
        requestedPlayer: '',
        requestedCard: '',
      },
      {
        playerName: '',
        avatarLink: '',
        playerSeat: 3,
        playerHand: [],
        currentPlayer: false,
        requestedPlayer: '',
        requestedCard: '',
      },
      {
        playerName: '',
        avatarLink: '',
        playerSeat: 4,
        playerHand: [],
        currentPlayer: false,
        requestedPlayer: '',
        requestedCard: '',
      },
    ],
    deck: [],
    inProgress: false,
    seated: false,
    ready: false,
    chatLog: {
      messages: [],
      connected: false,
    },
  };

  componentDidMount = () => {
    socket = socketClient(`${config.API_SOCKET_ENDPOINT}`, {
      path: config.SOCKET_PATH,
      // path will be based on url
    });

    let count = 0;
    socket.on('messageResponse', (msg) => {
      console.log(msg);
      // individual message response
      msg = (
        <div key={count}>
          {msg.user}: {msg.value}
        </div>
      );
      count++;
      this.setState({
        chatLog: {
          ...this.state.chatLog,
          messages: [...this.state.chatLog.messages, msg],
          connected: true,
        },
      });
    });

    this.onPlayerJoin();

    socket.on('serverResponse', (retObj) => {
      this.setState({
        self_info: this.state.self_info ? this.state.self_info : retObj.self,
        chatLog: {
          room: retObj.room,
          players: retObj.players,
          connected: true,
          messages: [...this.state.chatLog.messages, retObj.message],
        },
      });
    });

    socket.on('seat chosen', (retObj) => {
      // console.log(retObj);

      const updatedPlayers = [...this.state.players];

      updatedPlayers[retObj.seat - 1].playerName = retObj.name;

      this.setState({ players: updatedPlayers });
    });

    socket.on('game start RESPONSE', (hand) => {
      // console.log(hand);
      // DO SOMETHING WITH hand
      // yikes?
      // const player = currentSeatOfDOMPlayer

      // console.log(currentSeatOfDOMPlayer);
      
      const updatedPlayers = [...this.state.players];
      
      for (let i = 0; i < updatedPlayers.length; i++) {
        if (
          updatedPlayers[i].playerName !== currentSeatOfDOMPlayer.playerName &&
          updatedPlayers[i].playerName !== ''
          ) {
          updatedPlayers[i].handCount = 7;
        }
      }
      
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
      console.log(`${requested} did not have a ${rankReq}, sorry ${asker}.`);
    });

    socket.on('draw card denied', (msg) => {
      alert(msg);
    });

    socket.on('update other player card count', (userObj) => {
      const updatedPlayers = [...this.state.players];
      const toUpdate = updatedPlayers.find(el => el.playerName === userObj.playerName);
      toUpdate.handCount = userObj.newCount;

      updatedPlayers[toUpdate.playerSeat - 1] = toUpdate;

      this.setState({ 
        players: updatedPlayers,
      })


    })

    socket.on('draw card fulfilled', (cardObj) => {
      currentSeatOfDOMPlayer.playerHand.push(cardObj.card);
      const updatedPlayers = [...this.state.players];

      updatedPlayers[
        currentSeatOfDOMPlayer.playerSeat - 1
      ] = currentSeatOfDOMPlayer;

      this.setState({
        players: updatedPlayers,
      });
    });

    socket.on('correct rank return', (gameObj) => {
      const { requested, asker, rankReq, CARD } = gameObj;
      currentSeatOfDOMPlayer.playerHand.push(CARD[0]);

      const updatedPlayers = [...this.state.players];
      updatedPlayers[
        currentSeatOfDOMPlayer.playerSeat - 1
      ] = currentSeatOfDOMPlayer;

      this.setState({
        players: updatedPlayers,
      });
      // gameObj returned,
      // requested, asker(self), reqRank, CARD

      // add CARD to hand
      // check for books
      // display next turn
      // console.log(`${requested} DID have a ${rankReq}! Good guess, ${asker}!`);
    });

    socket.on('other player turn', (retObj) => {
      // console.log(retObj);
      const name = retObj.playerName;

      const updatedPlayers = [...this.state.players];

      const playerToUpdate = this.state.players.find(
        (el) => el.playerName === name
      );
      playerToUpdate.currentPlayer = true;

      const indexOfPlayerToUpdate = this.state.players.indexOf(playerToUpdate);

      updatedPlayers[indexOfPlayerToUpdate] = playerToUpdate;

      this.setState({
        players: updatedPlayers,
      });
    });

    socket.on('your turn', () => {
      // console.log(currentSeatOfDOMPlayer);

      const updatedPlayers = [...this.state.players];

      // make sure all players are false before setting current dom seat true
      updatedPlayers.forEach((el) => {
        el.currentPlayer = false;
      });

      currentSeatOfDOMPlayer.currentPlayer = true;

      updatedPlayers[
        currentSeatOfDOMPlayer.playerSeat - 1
      ] = currentSeatOfDOMPlayer;

      this.setState({
        players: updatedPlayers,
      });
    });








    socket.on('game end', (someinfo) => {
      // someinfo that we'll do something vague
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
  };

  askOtherPlayer = (e) => {
    e.preventDefault();
    const requestedId = e.target['to-ask-id'].value;
    const requestedName = this.state.chatLog.players.find(el => el.id === requestedId).playerName
    // console.log(requestedName);
    const rankReq = e.target['rank-requested'].value;
    const user_id = this.state.self_info.socket_id;
    const name = this.context.userData.player;
    const asker = {
      user_id,
      name,
      currentCount: currentSeatOfDOMPlayer.playerHand.length,
    }
    const requested = {
      requestedId,
      requestedName,
    }


    socket.emit('request rank from player', {

      asker,
      requested,
      rankReq,
    });
  };

  yesResponse = () => {
    // console.log(this.state.asked)
    const player = currentSeatOfDOMPlayer;

    // VALIDATE
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

    // VALIDATE
    const player = currentSeatOfDOMPlayer;
    const cardInHand = player.playerHand.find(
      (el) => el.value == this.state.chatLog.asked.rankReq
    );
    if (cardInHand) {
      // const index = player.playerHand.indexOf(cardInHand);
      alert(`You do have a ${this.state.chatLog.asked.rankReq} in hand`);
      // const CARD = player.playerHand.splice(index, 1);
      // console.log(CARD)
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
    const room = this.props.match.params.game_id;
    /* ROOM ID WILL BE BASED ON THIS ^ */
    const playerName = this.context.userData.player;
    const user_id = this.context.userData.id;
    const avatarLink = this.context.userData.avatar;
    const userObj = {
      room,
      playerName,
      user_id,
      avatarLink,
    };
    this.setState({ user: playerName });
    socket.emit('joinServer', userObj);
  };

  onCardChoice = (card) => {
    // console.log(card);

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

  gameReadyCheck = () => {
    this.setState({
      ready: true,
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

  countPlayers = () => {};

  setsChecker = (i) => {
    const { players } = this.state;
    //const books = []; //place books in state?
    // client side validation then send book to server

    const playerCards = currentSeatOfDOMPlayer.playerHand;
    const cardsInHand = {};
    // card.value and card.suit

    // create hashmap
    // each value, and indices of each
    for (let i = 0; i < playerCards.length; i++) {
      if (cardsInHand[playerCards[i].value]) {
        // assuming 2 is our limit for now
        // cardsInHand[playerCards[i].value].count++;
        // we dont actually need this ^
        cardsInHand[playerCards[i].value].push(i);
      } else {
        cardsInHand[playerCards[i].value] = [i];
      }
    }

    const booksObj = [];
    // console.log(cardsInHand);
    for (var value in cardsInHand) {
      if (cardsInHand[value].length > 1) {
        for (let i = 0; i < playerCards.length; i++) {
          if (playerCards[i].value == value) {
            booksObj.push(playerCards.splice(i, 1)[0]);
            i--;
          }
        }
      }
    }
    // currentSeat is updated, since playerCards is a reference
    // console.log(currentSeatOfDOMPlayer.playerHand);

    // do SOMETHING with serverObj
    console.log(booksObj);

    if (booksObj.length >= 1) {
      
      socket.emit('book found', {
        // booksObj, // two or more card objects
        // userinfo (this.state.self_info.socket_id, or just socket.id, and/or this.context.username)
        cardsInBook: booksObj,
        playerName: currentSeatOfDOMPlayer.playerName,
        playerCardCount: currentSeatOfDOMPlayer.playerHand.length
      })
      

      const updatedPlayers = [...this.state.players];
      currentSeatOfDOMPlayer.books = [...booksObj];

      updatedPlayers[
        currentSeatOfDOMPlayer.playerSeat - 1
      ] = currentSeatOfDOMPlayer;

      this.setState({
        players: updatedPlayers,
      });
    } else {
      alert('no books found');
    }

    this.nextTurn();
  };

  startGame = () => {
    const { players } = this.state.chatLog;

    if (players.length > 1) {
      socket.emit('start game', players);
    } else {
      alert('Not enough players in room, need 2 or more');
    }
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
    // actions one can take in a turn?
    // players may ask another player
    // in response to that,
    // they may draw a card or check for sets
    // both of those must setState currentTurn false
    currentSeatOfDOMPlayer.currentPlayer = false;

    const updatedPlayers = [...this.state.players];
    updatedPlayers[
      currentSeatOfDOMPlayer.playerSeat - 1
    ] = currentSeatOfDOMPlayer;

    this.setState({
      players: updatedPlayers,
    });

    socket.emit('next turn');

    // socket.id and indexing in the server
  };

  render() {
    const { players, seated } = this.state;
    const count = this.countPlayers();
    const currentPlayerTurn = this.state.players.find(
      (el) => el.currentPlayer === true
    );
    return (
      <>
        <Section className="game-table">
          {players.map((player, index) => {
            return (
              <GameTableSeat
                key={index}
                player={player}
                count={count}
                onCardChoice={this.onCardChoice}
                claimSeat={this.claimSeat}
                seated={seated}
              />
            );
          })}
          <div className="center">
            <div>
              {currentPlayerTurn
                ? `${currentPlayerTurn.playerName}'s turn`
                : ''}
            </div>
            <Button
              disabled={
                this.state.inProgress === false ||
                currentSeatOfDOMPlayer.currentPlayer === false
              }
              onClick={() => this.setsChecker()}
            >
              Do I have any sets?
            </Button>
            <br />

            <Button
              disabled={this.state.inProgress === true}
              onClick={() => this.gameReadyCheck()}
            >
              Ready
            </Button>
            <Button
              disabled={
                this.state.ready === false || this.state.inProgress === true
              }
              onClick={() => this.startGame()}
            >
              Start Game
            </Button>
            <Button
              disabled={
                this.state.inProgress === false ||
                currentSeatOfDOMPlayer.currentPlayer === false
              }
              onClick={this.gofish}
            >
              Draw
            </Button>
            <ChatLog
              match={this.props.match}
              onChatMessageSubmit={this.onChatMessageSubmit}
              askAnotherPlayer={this.askOtherPlayer}
              requestedCard={
                currentSeatOfDOMPlayer
                  ? currentSeatOfDOMPlayer.requestedCard
                  : ''
              }
              yesResponse={this.yesResponse}
              noResponse={this.noResponse}
              upperState={this.state.chatLog}
              chatRenders={this.state.chatRenders}
            />
          </div>
        </Section>
      </>
    );
  }
}
