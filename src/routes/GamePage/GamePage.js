import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ChatLog from '../../components/Chat/ChatLog';

class GamePage extends React.Component {
    state = {
        ingame: false,
    }

    joinGame(e) {
        e.preventDefault();
        const { roomRequest } = e.target;
        this.props.history.push(`/game/${roomRequest.value}`)
        this.setState({ ingame: true });
    }

    render() {
        return (
            <div>
                { (this.state.ingame)
                    ? <Route path={'/game/*'} component={ChatLog} />
                    : <div>
                        <form onSubmit={e => this.joinGame(e)}>
                            <input type="text" id="room_request" name="roomRequest" />
                            <button type="submit">Join a game</button>
                        </form>
                    </div>
                }
            </div>
        )
    }
}

export default GamePage;