import React, { Component } from 'react';
import { Section } from '../../components/Utils/Utils';
import RegisterForm from '../../components/RegistrationForm/RegistrationForm';

export default class RegisterPage extends Component {
  static defaultProps = {
    history: {
      push: () => {},
    },
  };

  handleRegistrationSuccess = () => {
    const { history } = this.props;
    history.push('/login');
  };

  render() {
    return (
      <Section className="RegisterPage">
        <h2>Register</h2>
        <RegisterForm onRegistrationSuccess={this.handleRegistrationSuccess} />
      </Section>
    );
  }
}
