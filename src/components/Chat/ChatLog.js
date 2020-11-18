import React from 'react';
import socketClient from 'socket.io-client';
import config from '../../config';
// import TokenService from '../../services/token-service';
import UserContext from '../../contexts/UserContext';


var socket;

class ChatLog extends React.Component {
    state = {
        messages: [],
        connected: false,
    }

    static contextType = UserContext;


    componentDidMount() {
        // console.log(this.props.match)
        let count = 0;
        socket = socketClient(`${config.API_SOCKET_ENDPOINT}`, {
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
            return <div>{el.playerName}, {el.id}</div>
            })
            
            this.setState({
                room: retObj.room,
                players: players,
                connected: true,
                messages: [...this.state.messages, retObj.message],
            })
        })
        socket.on('gameFull', (message) => {
            alert(message);
        })

        // socket.on('serverResponse', (obj) => {
        //     this.props.history.push(obj.urlEndpoint)
        // })
        /*
            map out server calls for tomorrow
            CLIENT RESPONSES =======

            socket.on('go fish', (reqObj) => {
                drawTopCard(selfId)
                nextTurn()
            })
            socket.on('correct rank return', () => {
                gameObj returned, 
                requested, asker(self), reqRank, CARD

                add CARD to hand
                check for books
                display next turn
            })
            socket.on('rank request from player', () => {
                asker, requested(self), reqRank,
                from would like to know if you (to) have reqRank

                not have reqRank > emit 'rank request denial'
                do have reqRank > {
                    remove from hand
                    emit 'rank request accept'
                }
            })



            CLIENT EMITS ============
            socket.emit('request rank from player', () => {
                user_id
                requestId (socket.id)
                requestedRank
            })

            socket.emit('rank request denial', () => {
                const requested = requestObj.user_id;
                const asker = requestObj.request_id;
                const reqRank = requestObj.requested_rank;


                requested does NOT have aany reqRank's, asker must go fish
            })
            socket.emit('rank request accept', () => {
                requested, asker, reqRank
                user DOES have card

                requested gives asker CARD, asked for reqRank

            })


            socket.emit('next turn click', () => {

            })

        */
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

    onJoinServerClick = () => {
        const room = this.props.match.params[0];
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
        
        console.log(userObj);
        socket.emit('joinServer', userObj);
    }
    

    render() {
        const messagesArr = this.state.messages.map((el, index) => {
        return <div key={index}>{el}</div>
        })
        return (
            <div>
                <div>
                    {this.state.room}
                </div>
                <div>
                    {messagesArr}
                </div>
                <form onSubmit={event => this.onSubmit(event)}>
                    <input type="text" id="input-message"/>
                    <button 
                    disabled={!this.state.connected}
                    type="submit">Send Message</button>
                </form>
                <button onClick={() => this.onJoinServerClick()}>Join Server</button>
                <div>
                    {this.state.players}
                </div>
            </div>
        )
    }
}

export default ChatLog;