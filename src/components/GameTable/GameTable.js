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
    players: [
      {
        playerName: '',
        playerSeat: 1,
        playerHand: [],
        books: [1, 2, 3, 4, 5, 6, 7, 8, 9],
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
    deck: [],
    inProgress: false,
    seated: false,
    ready: false,
    chatLog: {
      messages: [],
    },
    endGame: true,
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
      msg = <div key={count}>{msg}</div>;
      count++;
      this.setState({
        chatLog: {
          messages: [...this.state.chatLog.messages, msg],
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

      this.setState({ players: updatedPlayers })
    })


    socket.on('game start RESPONSE', (hand) => {
      console.log(hand);
      // DO SOMETHING WITH hand
      // yikes?
      // const player = currentSeatOfDOMPlayer

      currentSeatOfDOMPlayer.playerHand = hand.hand;
      console.log(currentSeatOfDOMPlayer);

      const updatedPlayers = [...this.state.players];

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
      console.log(`${requested} DID have a ${rankReq}! Good guess, ${asker}!`);
    });
  };

  onChatMessageSubmit = (event) => {
    event.preventDefault();
    const room = this.props.match.params.game_id;
    const userObj = {
      value: event.target['input-message'].value,
      room,
    };

    socket.emit('serverMessage', userObj);
  };

  askOtherPlayer = (e) => {
    e.preventDefault();
    const requestedId = e.target['to-ask-id'].value;
    const rankReq = e.target['rank-requested'].value;
    const user_id = this.state.self_info.socket_id;

    socket.emit('request rank from player', {
      user_id,
      requestedId,
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

    socket.emit('joinServer', userObj);
  };

  onCardChoice = (card) => {
    // console.log(card);

    currentSeatOfDOMPlayer.requestedCard = card;
    console.log(currentSeatOfDOMPlayer);

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

  gofish = () => { };

  countPlayers = () => { };

  setsChecker = (i) => {
    const { players } = this.state;
    //const books = []; //place books in state?
    // client side validation then send book to server

    const playerCards = currentSeatOfDOMPlayer.playerHand;
    const cardsInHand = {};
    // card.value and card.suit

    // create hashmap
    // each value, and indexes of each
    for (let i = 0; i < playerCards.length; i++) {
      if (cardsInHand[playerCards[i].value]) {
        // assuming 2 is our limit for now
        // cardsInHand[playerCards[i].value].count++;
        // we dont actually need this ^
        console.log("test", cardsInHand[playerCards[i].value])
        cardsInHand[playerCards[i].value].push(i)
      } else {
        cardsInHand[playerCards[i].value] = [i]
      }
    }
    // console.log("serverObj Outside BEFORE", serverObj);

    const serverObj = [];
    console.log("cardsInHand", cardsInHand);
    for (var value in cardsInHand) {
      if (cardsInHand[value].length > 1) {
        for (let i = 0; i < playerCards.length; i++) {
          if (playerCards[i].value == value) {
            serverObj.push(playerCards.splice(i, 1)[0])
            i--;
            console.log("serverObj AFTER", serverObj);
          }
        }
      }
    }
    // currentSeat is updated, since playerCards is a reference
    console.log("currentSeatOfDOMPlayer.playerHand", currentSeatOfDOMPlayer.playerHand);

    // do SOMETHING with serverObj
    console.log("serverObj Outside AFTER", serverObj);

    /*
    socket.emit('book found', {
      serverObj, // two or more card objects
      userinfo (this.state.self_info.socket_id, or just socket.id, and/or this.context.username)
    }
    */

    const updatedPlayers = [...this.state.players];
    updatedPlayers[currentSeatOfDOMPlayer.playerSeat - 1] = currentSeatOfDOMPlayer;

    this.setState({
      players: updatedPlayers,
    });

  }

  startGame = () => {
    const { players } = this.state.chatLog;

    if (players.length > 1) {
      socket.emit('start game', players);
    } else {
      alert('Not enough players in room, need 2 or more');
    }
  };
  endGame = () => {
    const { totalBooks } = this.state.players.books
    if (totalBooks.length === 9) {
      //display end game & winner (if player has highest books)
      this.setState({
        endGame: true
      });
      //displayWinner()
      //to-do: stop socket connection?
      //alert players that the game has ended...implement a displayWinner func
      alert('The game has ended')
    }
    // else {
    //   //game is inProgress
    //   //probably dont need this^
    // }
  };

  displayWinner = () => {
    const { players } = this.state
    for (let i = 0; i < this.players.length; i++) {
      const winner = ''
      if (players[i].books.length > 2) {
        return players.playerName[i]
      }
    }
    this.setState({
      winner: this.state
    });

  }




  requestCard = () => {
    console.log('hi');
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

    console.log(name, seat, roomPlayers)
    socket.emit('claim seat', { name, seat, roomPlayers });
  }



  render() {
    const { players, seated, endGame, winner } = this.state;
    const count = this.countPlayers();
    //if it's the end of game display x, otherwise display the game btns and table
    //gameChatLog is always displayed
    return (
      <>
        { endGame === true ? (
          <div className='winner-display'>The winner is {winner}! The game is over now. <br /><button>Rematch</button></div>
        ) : (
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
              </Section>

              <Button
                //disabled={this.state.inProgress === false}
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
                disabled={this.state.inProgress === false}
                onClick={this.gofish}
              >
                Draw
        </Button>
            </>
          )}
        <ChatLog
          match={this.props.match}
          onChatMessageSubmit={this.onChatMessageSubmit}
          askAnotherPlayer={this.askOtherPlayer}
          requestedCard={
            currentSeatOfDOMPlayer ? currentSeatOfDOMPlayer.requestedCard : ''
          }
          yesResponse={this.yesResponse}
          noResponse={this.noResponse}
          upperState={this.state.chatLog}
          chatRenders={this.state.chatRenders}
        />

      </>
    );
  }
}
