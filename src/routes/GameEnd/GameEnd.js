import React from 'react';
import NoWinner from '../../components/NoWinner/NoWinner';

class GameEnd extends React.Component {
  render() {
    return (
      <div>
        <NoWinner {...this.props} />
      </div>
    );
  }
}

export default GameEnd;
