import React from 'react';
import socketClient from 'socket.io-client';
import config from '../../config';


var socket;

class ChatLog extends React.Component {
    state = {
        messages: [],
    }
    componentDidMount() {
        let count = 0;
        socket = socketClient(config.SERVER_URL);
        socket.on('messageResponse', (msg) => {
                // individual message response
            msg = <div key={count}>{msg}</div>;
            count++;
            this.setState({messages: [...this.state.messages, msg]})
        })
    }

    onSubmit = (event) => {
        event.preventDefault();

        socket.emit('chatMessage', event.target['input-message'].value);
    }

    render() {
        return (
            <div>
                <div>
                    {this.state.messages}
                </div>
                <form onSubmit={event => this.onSubmit(event)}>
                    <input type="text" id="input-message"/>
                    <button type="submit">Send Message</button>
                </form>
            </div>
        )
    }
}

export default ChatLog;