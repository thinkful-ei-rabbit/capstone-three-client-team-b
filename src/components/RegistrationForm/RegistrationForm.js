import React, { Component } from 'react';
import AuthApiService from '../../services/auth-api-service';
import { Input, Required, Button } from '../Utils/Utils';

import './RegistrationForm.css';

export default class RegisterForm extends Component {
  static defaultProps = {
    onRegistrationSuccess: () => {},
  };

  state = { error: null };

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { email, password, player_name, avatar } = ev.target;

    this.setState({ error: null });
    AuthApiService.postUser({
      playerName: player_name.value,
      avatarLink: avatar.value,
      email: email.value,
      password: password.value,
    })
      .then((user) => {
        player_name.value = '';
        avatar.value = '';
        email.value = '';
        password.value = '';
        this.props.onRegistrationSuccess();
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  render() {
    const { error } = this.state;
    return (
      <form className="RegistrationForm" onSubmit={this.handleSubmit}>
        <div role="alert">{error && <p className="red">{error}</p>}</div>
        <div className="player_name">
          <label htmlFor="RegistrationForm_player_name">
            Player Name <Required />
          </label>
          <Input
            name="player_name"
            type="text"
            required
            id="RegistrationForm_player_name"
            className="login_reg_inputs"
          ></Input>
        </div>
        <div className="avatar">
          <label htmlFor="RegistrationForm_avatar">
            Player Name <Required />
          </label>
          <Input
            name="avatar"
            type="text"
            required
            id="RegistrationForm_avatar"
            className="login_reg_inputs"
          ></Input>
        </div>
        <div className="email">
          <label htmlFor="RegistrationForm_email">
            Email <Required />
          </label>
          <Input
            name="email"
            type="text"
            required
            id="RegistrationForm_email"
            className="login_reg_inputs"
          ></Input>
        </div>
        <div className="password">
          <label htmlFor="RegistrationForm_password">
            Password <Required />
          </label>
          <Input
            name="password"
            type="password"
            required
            id="RegistrationForm_password"
            className="login_reg_inputs"
          ></Input>
        </div>
        <Button className="login_reg_buttons standard" type="submit">
          Register
        </Button>
      </form>
    );
  }
}
