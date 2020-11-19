import React, { Component } from 'react';
import { Button, Section } from '../../components/Utils/Utils';
import { Link } from 'react-router-dom';

import './LandingPage.css';

export default class LandingPage extends Component {
  render() {
    return (
      <Section>
        <h1>Hello!</h1>
        <Link to="/table">
          <Button>Table view</Button>
        </Link>
      </Section>
    );
  }
}
