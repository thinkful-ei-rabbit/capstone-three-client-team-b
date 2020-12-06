import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import GameEnd from './GameEnd';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <GameEnd />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
