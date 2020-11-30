import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import TokenService from '../../services/token-service';
import Logo from '../Logo/Logo';
import './Header.css';

class Header extends Component {
  static contextType = UserContext;

  handleLogoutClick = () => {
    TokenService.clearAuthToken();
    this.context.handleLogout();
  };

  renderLogoutLink() {
    return (
      <div className="header-links">
        <Link onClick={this.handleLogoutClick} to="/">
          Logout
        </Link>
        <Link to="/">Home</Link>
      </div>
    );
  }

  renderLoginLink() {
    return (
      <div className="header-links">
        <Link to="/login">Log in</Link>
        <Link to="/register">Register</Link>
        <Link to="/">Home</Link>
      </div>
    );
  }

  render() {
    return (
      <>
        <nav className="Header">
          <h1><Logo /></h1>
          {TokenService.hasAuthToken()
            ? this.renderLogoutLink()
            : this.renderLoginLink()}
        </nav>
        
        <div className="box">
          <div className="wave -one"></div>
          <div className="wave -two"></div>
          <div className="wave -three"></div>
        </div>
      </>
    );
  }
}

export default withRouter(Header);
