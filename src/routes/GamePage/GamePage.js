import React from 'react';
import TableList from '../../components/TableList/TableList';

class GamePage extends React.Component {
  render() {
    return (
      <div>
        <TableList {...this.props} />
      </div>
    );
  }
}

export default GamePage;
