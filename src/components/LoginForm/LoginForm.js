import React, { Component } from 'react';
import TokenService from '../../services/token-service';
import AuthApiService from '../../services/auth-api-service';
import { Button, Input } from '../Utils/Utils';

import jwt_decode from 'jwt-decode';
import './LoginForm.css';

export default class LoginForm extends Component {
  static defaultProps = {
    onLoginSuccess: () => {},
  };

  state = { error: null };

  handleSubmitJwtAuth = (ev) => {
    ev.preventDefault();
    this.setState({ error: null });
    const { email, password } = ev.target;

    AuthApiService.postLogin({
      email: email.value,
      password: password.value,
    })
      .then((res) => {
        email.value = '';
        password.value = '';
        TokenService.saveAuthToken(res.authToken);
        this.props.onLoginSuccess(jwt_decode(res.authToken));
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  render() {
    const { error } = this.state;
    return (
      <form className="LoginForm" onSubmit={this.handleSubmitJwtAuth}>
        <div role="alert">{error && <p className="red">{error}</p>}</div>
        <div className="email">
          <label htmlFor="LoginForm_email">Email Address</label>
          <Input
            required
            name="email"
            id="LoginForm_email"
            className="login_reg_inputs"
          ></Input>
        </div>
        <div className="password">
          <label htmlFor="LoginForm_password">Password</label>
          <Input
            required
            name="password"
            type="password"
            id="LoginForm_password"
            className="login_reg_inputs"
          ></Input>
        </div>
        <Button className="standard login_reg_buttons" type="submit">
          Login
        </Button>
      </form>
    );
  }
}
