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
        asked: false,
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
            this.setState({ messages: [...this.state.messages, msg] })
        })

        socket.on('serverResponse', (retObj) => {
            this.setState({
                self: (this.state.self) ? this.state.self : retObj.self,
                room: retObj.room,
                players: retObj.players,
                connected: true,
                messages: [...this.state.messages, retObj.message],
            })
        })
        socket.on('gameFull', (message) => {
            alert(message);
        })

        socket.on('rank request from player', (requestObj) => {
            this.setState({ asked: requestObj })
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


        // map out server calls for tomorrow
        // CLIENT RESPONSES =======

        /*
        
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

    askOtherPlayer(e) {
        e.preventDefault();
        const requestedId = e.target['to-ask-id'].value;
        const rankReq = e.target['rank-requested'].value;
        const user_id = this.state.self.socket_id;

        socket.emit('request rank from player', {
            user_id,
            requestedId,
            rankReq,
        })
    }

    yesResponse() {
        // console.log(this.state.asked);

        // VALIDATE 

        const CARD = this.state.asked.rankReq// this.hand.splice(index, 1);
        socket.emit('rank request accept', {
            ...this.state.asked, CARD,
        })


        // after yes or no click, return to basic screen
        this.setState({ asked: null })
    }

    noResponse() {
        // console.log(this.state.asked);

        // VALIDATE

        socket.emit('rank request denial', {
            ...this.state.asked,
        })

        // after yes or no click, return to basic screen
        this.setState({ asked: null })
    }

    render() {
        let players = [];
        if (this.state.players) {
            players = this.state.players.map((el, index) => {
                // el.id, el.name, .room
                return <div key={index}>{el.playerName}, {el.id}</div>
            })
        }
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
                    <input type="text" id="input-message" />
                    <button
                        disabled={!this.state.connected}
                        type="submit">Send Message</button>
                </form>
                <button onClick={() => this.onJoinServerClick()}>Join Server</button>
                <form onSubmit={(e) => this.askOtherPlayer(e)}>
                    <input placeholder="id of player" type="text" id="to-ask-id" />
                    <input placeholder="rank requested" type="text" id="rank-requested" />
                    <button type="submit">Ask Other Player</button>
                </form>
                {
                    this.state.asked && <div>
                        <button onClick={() => this.yesResponse()}>Yes</button>
                        <button onClick={() => this.noResponse()}>No</button>
                    </div>}
                <div>
                    {players}
                </div>
            </div>
        )
    }
}

export default ChatLog;