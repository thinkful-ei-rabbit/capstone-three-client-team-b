import React from 'react';
// import TokenService from '../../services/token-service';
import UserContext from '../../contexts/UserContext';
import './ChatLog.css';

let socket;

class ChatLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      connected: false,
      asked: '',
      players: [],
    };
  }

  static defaultProps = {
    messages: [],
  };
  static contextType = UserContext;

  componentWillReceiveProps(props) {
    if (props.upperState) {
      this.setState({
        messages: props.upperState.messages,
        connected: props.upperState.connected,
        asked: props.upperState.asked,
        players: props.upperState.players,
      });
    }
  }

  componentDidMount() {
    this.setState({ connected: true });
  }

  render() {
    let players = [];
    let messagesArr = [];
    if (this.state) {
      if (this.state.players) {
        players = this.state.players.map((el, index) => {
          // el.id, el.name, .room
          return (
            <div key={index} onClick={() => this.props.onPlayerChoice(el)}>
              {el.playerName}, {el.id}
            </div>
          );
        });
      }
      messagesArr = this.state.messages.map((el, index) => {
        return <div key={index}>{el}</div>;
      });
    }
    return (
      <div>
        <div>{this.state.room}</div>
        <div id="chatBox">
          <div id="message">{messagesArr}</div>
          <div id="feedback"></div>
        </div>
        <form onSubmit={(event) => this.props.onChatMessageSubmit(event)}>
          <input
            onKeyPress={this.props.handleKeyPress}
            type="text"
            id="input-message"
          />
          <button disabled={!this.state.connected} type="submit">
            Send Message
          </button>
        </form>
        <form onSubmit={(e) => this.props.askAnotherPlayer(e)}>
          <input
            placeholder="name of player"
            type="text"
            id="to-ask-id"
            value={
              this.props.requestedPlayer
                ? this.props.requestedPlayer.playerName
                : ''
            }
            readOnly
            required
          />
          <input
            placeholder="rank requested"
            type="text"
            id="rank-requested"
            value={this.props.requestedCard}
            readOnly
            required
          />
          <button type="submit" disabled={this.props.askDisabled}>
            Ask Other Player
          </button>
        </form>
        {this.state.asked && (
          <div>
            <button onClick={() => this.props.yesResponse()}>Yes</button>
            <button onClick={() => this.props.noResponse()}>No</button>
          </div>
        )}
        <div>{players}</div>
      </div>
    );
  }
}

export default ChatLog;
