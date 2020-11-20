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
    chatLog: {
      messages: [],
    },
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


    socket.on('game start RESPONSE', (hand) => {
      console.log(hand)
      // DO SOMETHING WITH hand
      // yikes?
      // const player = currentSeatOfDOMPlayer

      currentSeatOfDOMPlayer.playerHand = hand.hand;
      console.log(currentSeatOfDOMPlayer);

      const updatedPlayers = [
        ...this.state.players,
      ]

      updatedPlayers[currentSeatOfDOMPlayer.playerSeat - 1] = currentSeatOfDOMPlayer;


      this.setState({
        inProgress: true,
        players: updatedPlayers
      });
      console.log(this.state.players);
    })


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
      currentSeatOfDOMPlayer.playerHand.push(CARD[0])


      const updatedPlayers = [...this.state.players]
      updatedPlayers[currentSeatOfDOMPlayer.playerSeat - 1] = currentSeatOfDOMPlayer;

      this.setState({
        players: updatedPlayers
      })
      // gameObj returned, 
      // requested, asker(self), reqRank, CARD

      // add CARD to hand
      // check for books
      // display next turn
      console.log(`${requested} DID have a ${rankReq}! Good guess, ${asker}!`);
    })


  }

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
    const cardInHand = player.playerHand.find(el => el.value == this.state.chatLog.asked.rankReq);

    if (cardInHand) {
      const index = player.playerHand.indexOf(cardInHand);

      const CARD = player.playerHand.splice(index, 1);
      socket.emit('rank request accept', {
        ...this.state.chatLog.asked, CARD,
      })
      // after yes or no click, return to basic screen
      this.setState({
        chatLog: {
          ...this.state.chatLog,
          asked: null
        }
      })
    } else {
      alert(`You do not have any ${this.state.asked.rankReq}s in hand`)
    }
  }

  noResponse = () => {
    // console.log(this.state.asked);

    // VALIDATE
    const player = currentSeatOfDOMPlayer;
    const cardInHand = player.playerHand.find(el => el.value == this.state.chatLog.asked.rankReq);
    if (cardInHand) {
      // const index = player.playerHand.indexOf(cardInHand);
      alert(`You do have a ${this.state.chatLog.asked.rankReq} in hand`)
      // const CARD = player.playerHand.splice(index, 1);
      // console.log(CARD)
    } else {
      socket.emit('rank request denial', {
        ...this.state.chatLog.asked,
      })
      // after yes or no click, return to basic screen
      this.setState({
        chatLog: {
          ...this.state.chatLog,
          asked: null
        }
      })
    }
  }

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
  }


  onCardChoice = (card) => {
    console.log(card);
    

    currentSeatOfDOMPlayer.requestedCard = card;
    console.log(currentSeatOfDOMPlayer);

    const updatedPlayers = [
      ...this.state.players,
    ]

    updatedPlayers[currentSeatOfDOMPlayer.playerSeat - 1] = currentSeatOfDOMPlayer;

    this.setState({
      players: updatedPlayers
    })
  }



  gameReadyCheck = () => {

    this.setState({
      ready: true
    });

  };


  gofish = () => {

  }

  countPlayers = () => {

  };

  startGame = () => {
    const { players } = this.state.chatLog;

    if (players.length > 1) {
      socket.emit('start game', players)
    } else {
      alert('Not enough players in room, need 2 or more');
    }

  };

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
      currentSeatOfDOMPlayer = {
        ...players[seat - 1],
        playerName: this.context.userData.player,
      };
    }
    players[seat - 1] = player;
    this.setState({
      players,
    });
    socket.emit('claim seat', { name, seat, roomPlayers });
  };

  render() {
    const { players } = this.state;
    const count = this.countPlayers();
    return (
      <>
        <Section className="game-table">
          {players
            .map((player, index) => {
              return (
                <GameTableSeat
                  key={index}
                  player={player}
                  count={count}
                  onCardChoice={this.onCardChoice}
                  claimSeat={this.claimSeat}
                />
              );
            })}
        </Section>

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
            this.state.inProgress === false
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
            (currentSeatOfDOMPlayer)
              ? currentSeatOfDOMPlayer.requestedCard
              : ''
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
