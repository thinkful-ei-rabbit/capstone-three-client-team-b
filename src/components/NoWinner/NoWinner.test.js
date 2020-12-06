import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import NoWinner from './NoWinner';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <NoWinner />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
