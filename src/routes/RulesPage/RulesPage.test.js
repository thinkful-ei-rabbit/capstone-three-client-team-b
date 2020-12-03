import React from 'react';
import ReactDOM from 'react-dom';
import RulesPage from './RulesPage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RulesPage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
