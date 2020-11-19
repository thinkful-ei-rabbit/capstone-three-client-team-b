import React, { Component } from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import { Section } from '../../components/Utils/Utils';

export default class LoginPage extends Component {
  static defaultProps = {
    location: {},
    history: {
      push: () => {},
    },
  };

  handleLoginSuccess = () => {
    const { history } = this.props;
    history.push(`/game`);
  };

  render() {
    return (
      <Section className="LoginPage">
        <h2>Login</h2>
        <LoginForm onLoginSuccess={this.handleLoginSuccess} />
      </Section>
    );
  }
}
