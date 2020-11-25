import React from 'react';
import ReactDOM from 'react-dom';
import ChatLog from './ChatLog';
import { BrowserRouter } from 'react-router-dom'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter><ChatLog /></BrowserRouter>
    , div);
  ReactDOM.unmountComponentAtNode(div);
});