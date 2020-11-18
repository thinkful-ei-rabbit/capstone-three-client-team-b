import React from 'react';
import socketClient from 'socket.io-client';
import config from '../../config';

var socket;

class TableList extends React.Component {
    state = {
        list: [],
    }

    componentDidMount() {
        socket = socketClient(`${config.API_ENDPOINT}`, {
            path: config.SOCKET_PATH,
        });

        socket.on('list response', (list) => {
            console.log(list);
            const list1 = [];
            let index = 0;
            for (var game in list) {
                list1.push(<div key={index}>Room {game}, {list[game].capacity} people in lobby</div>)
                index++;
            }
            this.setState({
                list: list1
            })
        });

        

        socket.emit('gather list', 'arbitrary message');
        // settimeout for callback rerender
    }

    // componentWillUnmount() { clearTimeout }

    render() {
        return (
            <div>
                {/* array of games */}
                Find a server!
                <div>
                    {this.state.list}
                </div>
            </div>
        )
    }
}

export default TableList;