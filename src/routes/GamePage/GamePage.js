import React from 'react';
import TableList from '../../components/TableList/TableList';

class GamePage extends React.Component {
  state = {
    ingame: false,
  };

  render(props) {
    return (
      <div>
        <TableList {...this.props} />
      </div>
    );
  }
}

export default GamePage;
