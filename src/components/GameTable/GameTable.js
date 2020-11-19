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
<<<<<<< HEAD
    ready: false,
=======
    chatLog: {
      messages: [],
    },
>>>>>>> f5c75d59dd9de0bf9a2a48748352d26b7343cc0f
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
          messages: [...this.state.chatLog.messages, msg]
        }
      })
    })

    socket.on('serverResponse', (retObj) => {
      this.setState({
        self_info: (this.state.self_info) ? this.state.self_info : retObj.self,
        chatLog: {
          room: retObj.room,
          players: retObj.players,
          connected: true,
          messages: [...this.state.chatLog.messages, retObj.message],
        }
      })
    })

    socket.on('gameFull', (message) => {
      alert(message);
    })

    socket.on('rank request from player', (requestObj) => {
      this.setState({
        chatLog: {
          ...this.state.chatLog,
          asked: requestObj
        }
      })
    })

    socket.on('go fish', (reqObj) => {
      const { asker, requested, rankReq } = reqObj;
      console.log(`${requested} did not have a ${rankReq}, sorry ${asker}.`)
    })

    socket.on('correct rank return', (gameObj) => {
      const { requested, asker, rankReq, CARD } = gameObj;
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
      room
    }

    socket.emit('serverMessage', userObj);
  }

  onJoinServerClick = () => {
    const room = this.props.match.params.game_id;
    /* ROOM ID WILL BE BASED ON THIS ^ */
    const playerName = this.context.userData.player;
    const user_id = this.context.userData.id; // context.user.user_id
    const avatarLink = this.context.userData.avatar; // context.user.avatarLink


    const userObj = {
      room,
      playerName,
      user_id,
      avatarLink,
    }

    socket.emit('joinServer', userObj);
  }

  askOtherPlayer = (e) => {
    e.preventDefault();
    const requestedId = e.target['to-ask-id'].value;
    const rankReq = e.target['rank-requested'].value;
    const user_id = this.state.self_info.socket_id;

    socket.emit('request rank from player', {
      user_id,
      requestedId,
      rankReq,
    })
  }

  yesResponse = () => {
    // console.log(this.state.asked);

    // VALIDATE 

    const CARD = this.state.chatLog.asked.rankReq// this.hand.splice(index, 1);
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
  }

  noResponse = () => {
    // console.log(this.state.asked);

    // VALIDATE

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
    // needs to outsource deck creation
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

        <ChatLog match={this.props.match} />
        <Button disabled={this.state.inProgress === true} onClick={() => this.createDeck()}>Ready</Button>
        <Button disabled={this.state.ready === false || this.state.inProgress === true} onClick={() => this.startGame()}>Start Game</Button>
        <Button disabled={this.state.inProgress === false || this.state.deck.cards.length === 0} onClick={this.gofish}>Draw</Button>
        <ChatLog
          match={this.props.match}
          onChatMessageSubmit={this.onChatMessageSubmit}
          onJoinServerClick={this.onJoinServerClick}
          askAnotherPlayer={this.askOtherPlayer}
          yesResponse={this.yesResponse}
          noResponse={this.noResponse}
          upperState={this.state.chatLog}
          chatRenders={this.state.chatRenders}
        />
      </>
    );
  }
}
