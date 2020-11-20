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
      /*
      if (count === 4) {
        //take out books
        //update hand display
        //where do books show up on the screen? do they show up on the screen or will there just be a "book won count"?
      }
      maybe have this logic in a helper function called takeOutSets
      */

      // display next turn 
      //maybe this could look similar to how the chat displays "userX is typing", but instead "it's {playerX}'s turn"
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

  //clicking this breaks the game, says "Cannot read property 'socket_id' of undefined"
  askOtherPlayer = (e) => {
    // console.log("test")
    e.preventDefault();
    const requestedId = e.target['to-ask-id'].value;
    const rankReq = e.target['rank-requested'].value;
    const user_id = this.state.self_info.socket_id;
    // console.log(user_id)
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
    const drawnCard = deck.draw();

    players.map(player => {
      if (player.currentPlayer === true) {
        console.log("test", player.playerHand)
        return player.playerHand.push(deck.cards[0])
        // return player.playerHand.push(drawnCard) //player not specified here
      }
    })
    deck.cards.shift()
    this.setState({ players, deck })
  }

  setsChecker = (i) => {
    /*
        const beasts = ['ant', 'bison', 'bison', 'camel', 'duck', 'bison', 'bison'];
        const newArr = beasts.filter(beasts => beasts.indexOf('bison') > -1)
        console.log("before1", newArr);
        const count = newArr.length
        console.log("before", newArr);
        if (count === 4) {
          //maybe create a pop-up message
          console.log("Nice, You made a book!\n", newArr)
          console.log("player's NEW hand(slice):", beasts.slice(newArr)) //doesnt work returns beasts
          //console.log("player's NEW hand(push):", beasts.push(newArr)) //doesnt work return 8?
          //console.log("player's NEW hand(nothing):", beasts) //doesnt work return 8?
        }
        console.log(beasts.indexOf('bison'));
        console.log("after", newArr);
        //console.log(booksss);
        // expected output: 1
    */
    //_------------------------------------------------//
    // const currentCards = player.playerHand
    //_------------------------------------------------//

    const { players, deck } = this.state;
    //const book = []; //place books in state under individual players

    players.map(player => {
      //if it's my turn
      if (player.currentPlayer === true) {
        console.log("player's hand:", player.playerHand)
        console.log("player's hand2:", player.playerHand.indexOf("Card"))

        const book = player.playerHand.filter(cards =>
          cards.value === 1 ||
          cards.value === 2 ||
          cards.value === 3 ||
          cards.value === 4 ||
          cards.value === 5 ||
          cards.value === 6 ||
          cards.value === 7 ||
          cards.value === 8 ||
          cards.value === 9 ||
          cards.value === 10 ||
          cards.value === 11 ||
          cards.value === 12 ||
          cards.value === 13
        )
        const count = book.length
        console.log("count:", count)

        if (count >= 2) {
          //maybe create a pop-up message
          console.log("Nice, You made a book!\n", book)
          //console.log("player's hand:", player.playerHand.slice(book)) //does this only slice off the first thing that matches


          return book
        }
        else {
          console.log("no books yet")
        }
      }

    })


    this.setState({
      players,
    });
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
              // console.log("players present", player)
              console.log("all the seats", players)
              // console.log("card requested", this.requestCard)

              return (
                <GameTableSeat
                  key={player.playerSeat}
                  player={player}
                  count={count}
                  requestCard={this.requestCard}
                />
              );
            }
            )}
        </Section>
        <Button disabled={this.state.ready === false || this.state.deck.cards.length === 0} onClick={() => this.setsChecker()}>Do I have any sets?</Button><br />
        <Button disabled={this.state.inProgress === true} onClick={() => this.createDeck()}>Ready</Button>
        <Button disabled={this.state.ready === false || this.state.inProgress === true} onClick={() => this.startGame()}>Start Game</Button>
        <Button disabled={this.state.inProgress === false || this.state.deck.cards.length === 0} onClick={this.gofish}>Draw</Button>
        <ChatLog
          match={this.props.match}
          onChatMessageSubmit={this.onChatMessageSubmit}
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
