import React from 'react';
// import TokenService from '../../services/token-service';
import UserContext from '../../contexts/UserContext';
import './ChatLog.css';

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
    requestedPlayer: {
      playerName: '',
    },
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

  renderInstructions = () => {
    if (this.props.requestedPlayer.playerName && this.props.requestedCard) {
      return '';
    } else if (
      !this.props.requestedPlayer.playerName &&
      this.props.requestedCard
    ) {
      return (
        <>
          <p className="turn-instructions">Click on a player</p>
        </>
      );
    } else if (
      this.props.requestedPlayer.playerName &&
      !this.props.requestedCard
    ) {
      return (
        <>
          <p className="turn-instructions">Click on a card</p>
        </>
      );
    } else {
      return (
        <>
          <p className="turn-instructions">Click on a player</p>
          <p className="turn-instructions">and</p>
          <p className="turn-instructions">Click on a card</p>
        </>
      );
    }
  };

  render() {
    let players = [];
    let messagesArr = [];
    if (this.state) {
      if (this.state.players) {
        players = this.state.players.map((el, index) => {
          // el.id, el.name, .room
          return (
            <div key={index} onClick={() => this.props.onPlayerChoice(el)}>
              {el.playerName}
            </div>
          );
        });
      }
      messagesArr = this.state.messages.map((el, index) => {
        return <div key={index}>{el}</div>;
      });
    }
    return (
      <div className="ChatLog-and-game-inputs">
        <div>{this.state.room}</div>
        {this.props.chatVisible ? (
          <div className="chat-box-container">
            <div className="roomPlayers">
              Players in room: {players.length}
              {players}
            </div>
            <div id="chatBox">
              <div id="message">{messagesArr}</div>
              <div id="feedback"></div>
            </div>
            <form
              className="chatLog-server-message-form"
              onSubmit={(event) => this.props.onChatMessageSubmit(event)}
              autoComplete="off"
            >
              <input
                onKeyPress={this.props.handleKeyPress}
                type="text"
                id="input-message"
                placeholder="Chat!"
              />{' '}
              <br />
              <button disabled={!this.state.connected} type="submit">
                Send
              </button>
            </form>
          </div>
        ) : (
          <div></div>
        )}
        {this.state.asked && (
          <div className="being-asked-box">
            <div>
              {this.state.asked.asker.name} is asking for a{' '}
              {this.state.asked.rankReq}, do you have one?
            </div>
            <div>
              <button onClick={() => this.props.yesResponse()}>Yes</button>
              <button onClick={() => this.props.noResponse()}>No</button>
            </div>
          </div>
        )}
        {!this.props.askDisabled ? (
          <form
            className="askOtherPlayer_form"
            onSubmit={(e) => this.props.askAnotherPlayer(e)}
          >
            {this.renderInstructions()}
            <input
              className="hidden-for-a-reason"
              placeholder="Select another player!"
              type="text"
              id="to-ask-id"
              value={this.props.requestedPlayer.playerName || ''}
              readOnly
              required
            />
            <input
              className="hidden-for-a-reason"
              placeholder="Select Card from your hand!"
              type="text"
              id="rank-requested"
              value={this.props.requestedCard || ''}
              readOnly
              required
            />
            {this.props.requestedPlayer.playerName &&
            this.props.requestedCard ? (
              <button type="submit">
                Ask {this.props.requestedPlayer.playerName} for a{' '}
                {this.props.requestedCard}
              </button>
            ) : (
              ''
            )}
          </form>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default ChatLog;
