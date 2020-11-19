import React from 'react';
import { Route, Switch } from 'react-router-dom';
import GameTable from '../../components/GameTable/GameTable';
import TableList from '../../components/TableList/TableList';
import UserContext from '../../contexts/UserContext';

class GamePage extends React.Component {
  static contextType = UserContext;

  state = {
    ingame: false,
  };

  joinGame(e) {
    e.preventDefault();
    const { roomRequest } = e.target;
    this.props.history.push(`/game/${roomRequest.value}`);
    this.setState({ ingame: true });
  }

  hostGame() {
    const randomRoom = Math.floor(Math.random() * 1000);
    this.props.history.push(`/game/${randomRoom}`);
    this.setState({ ingame: true });
  }

  render() {
    return (
      <div>
        <button onClick={() => this.hostGame()}>Host a game</button>
        <form onSubmit={(e) => this.joinGame(e)}>
          <input
            type="text"
            id="room_request"
            name="roomRequest"
            placeholder="know the room id?"
          />
          <button type="submit">Join a game</button>
        </form>
        <div>
          <TableList />
        </div>
      </div>
    );
  }
}

export default GamePage;
