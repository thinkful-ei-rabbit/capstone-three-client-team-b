import React, { Component } from 'react';
import socketClient from 'socket.io-client';
import config from '../../config';
import UserContext from '../../contexts/UserContext';

let socket;

export default class TableList extends Component {
  static contextType = UserContext;
  state = {
    list: [],
    interval: 0,
  };

  componentDidMount() {
    let interval = setInterval(this.refreshList, 1000);
    this.setState({ interval: interval });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  hostGame = () => {
    const randomRoom = Math.floor(Math.random() * 1000);
    this.onJoinServerClick(randomRoom);
  };

  refreshList = () => {
    socket = socketClient(`${config.API_SOCKET_ENDPOINT}`, {
      path: config.SOCKET_PATH,
    });

    socket.on('list response', (list) => {
<<<<<<< HEAD
      console.log('list', list);
=======
>>>>>>> 702feec9a928bdcebd031b66b179f790ceeb1cec
      const list1 = [];
      let index = 0;
      for (let game in list) {
        list1.push(
          <div key={index}>
            Room {game}, {list[game].capacity}/4 -{' '}
            {list[game].capacity < 4 ? (
              <button onClick={() => this.onJoinServerClick(game)}>Join</button>
            ) : (
              'no seats available'
            )}
          </div>
        );
        index++;
      }
      this.setState({
        list: list1,
      });
    });

    socket.emit('gather list', 'arbitrary message');
  };

  onJoinServerClick = (game) => {
    
    this.props.history.push(`/game/${game}`);
  };

  render() {
    return (
      <>
        <button onClick={() => this.hostGame()}>Host a game</button>
        <div>
          {/* array of games */}
          Find a server!
          <div>{this.state.list}</div>
        </div>
      </>
    );
  }
}
