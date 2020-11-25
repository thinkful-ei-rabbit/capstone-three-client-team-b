import React from 'react';
import ReactDOM from 'react-dom';
import RegisterForm from './RegistrationForm';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RegisterForm />, div);
  ReactDOM.unmountComponentAtNode(div);
});
