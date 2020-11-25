import React from 'react';
import ReactDOM from 'react-dom';
import GameTable from '../components/GameTable/GameTable';
import { BrowserRouter } from 'react-router-dom'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter><GameTable /></BrowserRouter>
    , div);
  ReactDOM.unmountComponentAtNode(div);
});