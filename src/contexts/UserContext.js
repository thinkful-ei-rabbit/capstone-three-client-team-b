import React, { Component } from 'react';
import TokenService from '../services/token-service';

const UserContext = React.createContext({
  userData: {},
  error: null,
  setError: () => {},
  clearError: () => {},
  setUser: () => {},
  handleLoginData: () => {},
  handleLogout: () => {},
});

export default UserContext;

export class UserProvider extends Component {
  constructor(props) {
    super(props);
    const state = { userData: {}, error: null };

    const jwtPayload = TokenService.parseAuthToken();

    if (jwtPayload)
      state.userData = {
        id: jwtPayload.user_id,
        player: jwtPayload.playerName,
        email: jwtPayload.sub,
        avatar: jwtPayload.avatarLink,
      };

    this.state = state;
  }

  setError = (error) => {
    this.setState({ error });
  };

  clearError = () => {
    this.setState({ error: null });
  };

  setUser = (userData) => {
    this.setState({ userData });
  };

  handleLoginData = (authToken) => {
    TokenService.saveAuthToken(authToken);
    const jwtPayload = TokenService.parseAuthToken();
    this.setUser({
      id: jwtPayload.user_id,
      player: jwtPayload.playerName,
      email: jwtPayload.sub,
      avatar: jwtPayload.avatarLink,
    });
  };

  handleLogout = () => {
    this.setUser({});
  };

  render() {
    const value = {
      userData: this.state.userData,
      error: this.state.error,
      setError: this.setError,
      clearError: this.clearError,
      setUser: this.setUser,
      handleLoginData: this.handleLoginData,
      handleLogout: this.handleLogout,
    };
    return (
      <UserContext.Provider value={value}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
