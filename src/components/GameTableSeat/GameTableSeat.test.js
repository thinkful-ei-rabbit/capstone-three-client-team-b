import React from 'react';
import ReactDOM from 'react-dom';
import GameTableSeat from './GameTableSeat';
import { BrowserRouter } from 'react-router-dom'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter><GameTableSeat /></BrowserRouter>
    , div);
  ReactDOM.unmountComponentAtNode(div);
});