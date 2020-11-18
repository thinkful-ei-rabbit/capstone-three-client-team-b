import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';

ReactDOM.render(
  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
