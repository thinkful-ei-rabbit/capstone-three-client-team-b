import React from 'react';
import socketClient from 'socket.io-client';
import config from '../../config';
import TokenService from '../../services/token-service';


var socket;

class ChatLog extends React.Component {
    state = {
        messages: [],
        connected: false,
    }
    componentDidMount() {
        // console.log(this.props.match)
        let count = 0;
        socket = socketClient(`${config.SERVER_URL}`, {
            path: config.SOCKET_PATH,
            // path will be based on url
        });
        socket.on('messageResponse', (msg) => {
                // individual message response
            msg = <div key={count}>{msg}</div>;
            count++;
            this.setState({messages: [...this.state.messages, msg]})
        })

        socket.on('serverResponse', (retObj) => {
            const players = retObj.players.map(el => {
                // el.id, el.name, .room
            return <div>{el.nickname}, {el.id}</div>
            })
            
            this.setState({
                room: retObj.room,
                players: players,
                connected: true,
            })
        })

        // socket.on('serverResponse', (obj) => {
        //     this.props.history.push(obj.urlEndpoint)
        // })
    }

    onSubmit = (event) => {
        event.preventDefault();
        const room = this.props.match.params[0];

        const userObj = {
            value: event.target['input-message'].value,
            room
        }

        socket.emit('serverMessage', userObj);
    }

    onExClick = () => {
        const room = this.props.match.params[0];
        /* ROOM ID WILL BE BASED ON THIS ^ */
        const username = 'Michael';
        socket.emit('joinServer', {room, username});
    }
    

    render() {
        return (
            <div>
                <div>
                    {this.state.room}
                </div>
                <div>
                    {this.state.messages}
                </div>
                <form onSubmit={event => this.onSubmit(event)}>
                    <input type="text" id="input-message"/>
                    <button 
                    disabled={!this.state.connected}
                    type="submit">Send Message</button>
                </form>
                <button onClick={() => this.onExClick()}>Join Server</button>
                <div>
                    {this.state.players}
                </div>
            </div>
        )
    }
}

export default ChatLog;