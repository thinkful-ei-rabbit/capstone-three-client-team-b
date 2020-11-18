import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from '../Utils/PrivateRoute';
import PublicOnlyRoute from '../Utils/PublicOnlyRoute';
import Header from '../Header/Header';
import LoginPage from '../../routes/LoginPage/LoginPage';
import RegistrationPage from '../../routes/RegistrationPage/RegistrationPage';
import LandingPage from '../../routes/LandingPage/LandingPage';
import GamePage from '../../routes/GamePage/GamePage';
import GameTable from '../../routes/GameTable/GameTable';

import './App.css';

export default class App extends Component {
  state = { hasError: false };

  render() {
    return (
      <div className="App">
        <header className="App_header">
          <Header />
        </header>
        <main>
          <Switch>
            <Route path={'/game'} component={GamePage} />
            <Route exact path={'/'} component={LandingPage} />
            <PublicOnlyRoute path={'/login'} component={LoginPage} />
            <PublicOnlyRoute path={'/register'} component={RegistrationPage} />
            <Route path={'/table'} component={GameTable} />
          </Switch>
        </main>
      </div>
    );
  }
}
